const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js');
const moment = require('moment');
const axios = require('axios')
require('dotenv').config();
const crypto = require('crypto')
const { logger } = require("../apps/logging.js")

const FRONTEND_URL = process.env.FRONTEND_URL;

function convertTimeToMinutes(time) {
    try {
        // Memisahkan jam dan menit
        const [hours, minutes] = time.split(':').map(Number);

        // Validasi format waktu
        if (isNaN(hours) || isNaN(minutes)) {
            throw new Error('Format waktu tidak valid');
        }

        // Validasi rentang waktu
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error('Waktu diluar rentang yang valid');
        }

        // Konversi ke total menit
        return (hours * 60) + minutes;

    } catch (error) {
        throw new Error(`Gagal mengkonversi waktu: ${error.message}`);
    }
}

const peminjamanService = {
    async createPeminjaman(userId, data) {
        const tanggal_cuti = await axios.get(process.env.API_DAY_OFF);

        const is_tanggal_mulai_cuti = tanggal_cuti.data.find((date) =>
            date.tanggal === data.tanggal_mulai
        );

        if (is_tanggal_mulai_cuti) {
            const keterangan = is_tanggal_mulai_cuti.is_cuti ? 'cuti bersama' : 'hari libur';
            throw new ResponseError(400, `Tidak bisa melakukan peminjaman pada ${keterangan}: ${is_tanggal_mulai_cuti.keterangan}`);
        }

        // Jika ada tanggal selesai, cek juga tanggal libur untuk rentang waktu
        if (data.tanggal_selesai) {
            const startDate = moment(data.tanggal_mulai);
            const endDate = moment(data.tanggal_selesai);

            // Cek setiap tanggal dalam rentang
            for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'days')) {
                const currentDate = date.format('YYYY-MM-DD');
                const is_tanggal_cuti = tanggal_cuti.data.find((d) => d.tanggal === currentDate);

                if (is_tanggal_cuti) {
                    const keterangan = is_tanggal_cuti.is_cuti ? 'cuti bersama' : 'hari libur';
                    throw new ResponseError(400, `Terdapat ${keterangan} dalam rentang peminjaman: ${is_tanggal_cuti.keterangan} (${currentDate})`);
                }
            }
        }

        // Validate user role
        const user = await prisma.pengguna.findUnique({
            where: { id: userId },
            include: {
                DetailPengguna: {
                    include: {
                        tim_kerja: {
                            select: {
                                is_aktif: true
                            }
                        }
                    }
                }
            }
        });

        if (user.role !== 'PEMINJAM' && user.role !== 'ADMIN') {
            throw new ResponseError(403, "hanya peminjam and admin yang melakukan peminjaman ");
        }

        if (user.role === 'PEMINJAM' && !user.DetailPengguna) {
            throw new ResponseError(400, "detail pengguna tidak ditemukan");
        }

        if (!user.DetailPengguna.tim_kerja) {
            throw new ResponseError(400, "Tim kerja tidak ditemukan");
        }

        if (!user.DetailPengguna.tim_kerja.is_aktif) {
            throw new ResponseError(400, "Tim Kerja ini tidak bisa melakukan peminjaman karena tidak aktif");
        }

        // Validate room existence
        const room = await prisma.ruangRapat.findUnique({
            where: { id: data.ruang_rapat_id }
        });

        if (!room) {
            throw new ResponseError(404, "ruang rapat tidak ditemukan");
        }

        // Validate date and time
        const now = moment();
        const bookingStartDate = moment(data.tanggal_mulai);
        const bookingEndDate = data.tanggal_selesai ? moment(data.tanggal_selesai) : bookingStartDate;

        if (bookingStartDate.isBefore(now, 'day')) {
            throw new ResponseError(400, "Tidak bisa meminjam dihari yang sudah lewat");
        }

        const existingBookings = await prisma.peminjaman.findMany({
            where: {
                ruang_rapat_id: data.ruang_rapat_id,
                OR: [
                    {
                        tanggal_mulai: {
                            gte: data.tanggal_mulai,
                            lte: data.tanggal_selesai || data.tanggal_mulai
                        }
                    },
                    {
                        tanggal_selesai: {
                            gte: data.tanggal_mulai,
                            lte: data.tanggal_selesai || data.tanggal_mulai
                        }
                    }
                ],
                status: {
                    in: ['DIPROSES', 'DISETUJUI']
                }
            }
        });

        const hasConflict = existingBookings.some(booking => {
            const existingStart = moment(`${booking.tanggal_mulai} ${booking.jam_mulai}`);
            const existingEnd = moment(`${booking.tanggal_selesai || booking.tanggal_mulai} ${booking.jam_selesai}`);
            const bookingStart = moment(`${data.tanggal_mulai} ${data.jam_mulai}`);
            const bookingEnd = moment(`${data.tanggal_selesai || data.tanggal_mulai} ${data.jam_selesai}`);

            return (bookingStart.isBetween(existingStart, existingEnd, undefined, '[]') ||
                bookingEnd.isBetween(existingStart, existingEnd, undefined, '[]') ||
                existingStart.isBetween(bookingStart, bookingEnd, undefined, '[]') ||
                existingEnd.isBetween(bookingStart, bookingEnd, undefined, '[]'));
        });

        if (hasConflict) {
            throw new ResponseError(400, "Ruangan sudah dipinjam pada waktu ini");
        }

        // Create booking
        const result = await prisma.peminjaman.create({
            data: {
                pengguna_id: userId,
                ruang_rapat_id: data.ruang_rapat_id,
                nama_kegiatan: data.nama_kegiatan,
                tanggal_mulai: data.tanggal_mulai,
                tanggal_selesai: data.tanggal_selesai,
                jam_mulai: data.jam_mulai,
                jam_selesai: data.jam_selesai,
                no_surat_peminjaman: data.no_surat_peminjaman,
                status: 'DIPROSES'
            },
            include: {
                Pengguna: {
                    select: {
                        nama_lengkap: true,
                        email: true
                    }
                },
                RuangRapat: true
            }
        });

        return result;
    },

    async updateStatus(userId, peminjamanId, updateData) {

        const tanggal_cuti = await axios.get(process.env.API_DAY_OFF);

        const is_tanggal_mulai_cuti = tanggal_cuti.data.find((date) =>
            date.tanggal === updateData.tanggal_mulai
        );

        if (is_tanggal_mulai_cuti) {
            const keterangan = is_tanggal_mulai_cuti.is_cuti ? 'cuti bersama' : 'hari libur';
            throw new ResponseError(400, `Tidak bisa melakukan peminjaman pada ${keterangan}: ${is_tanggal_mulai_cuti.keterangan}`);
        }

        // Jika ada tanggal selesai, cek juga tanggal libur untuk rentang waktu
        if (updateData.tanggal_selesai) {
            const startDate = moment(updateData.tanggal_mulai);
            const endDate = moment(updateData.tanggal_selesai);

            // Cek setiap tanggal dalam rentang
            for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'days')) {
                const currentDate = date.format('YYYY-MM-DD');
                const is_tanggal_cuti = tanggal_cuti.data.find((d) => d.tanggal === currentDate);

                if (is_tanggal_cuti) {
                    const keterangan = is_tanggal_cuti.is_cuti ? 'cuti bersama' : 'hari libur';
                    throw new ResponseError(400, `Terdapat ${keterangan} dalam rentang peminjaman: ${is_tanggal_cuti.keterangan} (${currentDate})`);
                }
            }
        }

        const user = await prisma.pengguna.findUnique({
            where: { id: userId }
        });

        if (user.role !== 'ADMIN') {
            throw new ResponseError(403, "Only ADMIN can update bookings");
        }

        const booking = await prisma.peminjaman.findUnique({
            where: { id: peminjamanId },
            include: {
                RuangRapat: true,
                Absensi: true
            }
        });

        if (!booking) {
            throw new ResponseError(404, "Booking not found");
        }

        if (!['DIPROSES', 'DISETUJUI'].includes(booking.status)) {
            throw new ResponseError(400, `Cannot update booking with status ${booking.status}. Only DIPROSES and DISETUJUI status can be updated`);
        }

        // Jika ada perubahan ruangan atau waktu, cek konflik jadwal
        if (updateData.ruang_rapat_id || updateData.tanggal_mulai || updateData.jam_mulai || updateData.jam_selesai) {
            const bookingStart = moment(`${updateData.tanggal_mulai || booking.tanggal_mulai} ${updateData.jam_mulai || booking.jam_mulai}`);
            const bookingEnd = moment(`${updateData.tanggal_selesai || booking.tanggal_selesai || updateData.tanggal_mulai || booking.tanggal_mulai} ${updateData.jam_selesai || booking.jam_selesai}`);

            const now = moment();
            if (bookingStart.isBefore(now)) {
                throw new ResponseError(400, "Cannot update to past time");
            }

            const existingBookings = await prisma.peminjaman.findMany({
                where: {
                    ruang_rapat_id: updateData.ruang_rapat_id || booking.ruang_rapat_id,
                    OR: [
                        { tanggal_mulai: updateData.tanggal_mulai || booking.tanggal_mulai },
                        { tanggal_selesai: updateData.tanggal_selesai || booking.tanggal_selesai || updateData.tanggal_mulai || booking.tanggal_mulai }
                    ],
                    status: {
                        in: ['DIPROSES', 'DISETUJUI']
                    },
                    NOT: {
                        id: peminjamanId
                    }
                }
            });

            const hasConflict = existingBookings.some(existing => {
                const existingStart = moment(`${existing.tanggal_mulai} ${existing.jam_mulai}`);
                const existingEnd = moment(`${existing.tanggal_selesai || existing.tanggal_mulai} ${existing.jam_selesai}`);

                return (bookingStart.isBetween(existingStart, existingEnd, undefined, '[]') ||
                    bookingEnd.isBetween(existingStart, existingEnd, undefined, '[]') ||
                    existingStart.isBetween(bookingStart, bookingEnd, undefined, '[]') ||
                    existingEnd.isBetween(bookingStart, bookingEnd, undefined, '[]'));
            });

            if (hasConflict) {
                throw new ResponseError(400, "Room is already booked for this time period");
            }
        }

        // Validasi alasan penolakan
        if (updateData.status === 'DITOLAK' && !updateData.alasan_penolakan) {
            throw new ResponseError(400, "Alasan penolakan harus diisi ketika menolak peminjaman");
        }

        // Handle absensi jika status disetujui
        let absensiData = null;
        if (updateData.status === 'DISETUJUI' && !booking.Absensi) {
            const uniqueCode = crypto.randomBytes(6).toString('hex');
            const linkAbsensi = `${FRONTEND_URL}/absensi?u=${uniqueCode}`;

            absensiData = await prisma.absensi.create({
                data: {
                    peminjaman_id: peminjamanId,
                    link_absensi: linkAbsensi
                }
            });
        }

        // Prepare update data
        const updateFields = {
            ruang_rapat_id: updateData.ruang_rapat_id,
            tanggal_mulai: updateData.tanggal_mulai,
            tanggal_selesai: updateData.tanggal_selesai,
            jam_mulai: updateData.jam_mulai,
            jam_selesai: updateData.jam_selesai,
            status: updateData.status,
            alasan_penolakan: updateData.status === 'DITOLAK' ? updateData.alasan_penolakan : null,
            nama_kegiatan: updateData.nama_kegiatan,
            no_surat_peminjaman: updateData.no_surat_peminjaman
        };

        // Remove undefined fields
        Object.keys(updateFields).forEach(key =>
            updateFields[key] === undefined && delete updateFields[key]
        );

        // Update peminjaman
        const updatedBooking = await prisma.$transaction(async (prisma) => {
            const updated = await prisma.peminjaman.update({
                where: { id: peminjamanId },
                data: updateFields,
                include: {
                    Pengguna: {
                        select: {
                            nama_lengkap: true,
                            email: true,
                            DetailPengguna: {
                                include: {
                                    tim_kerja: true
                                }
                            }
                        }
                    },
                    RuangRapat: true,
                    Absensi: true
                }
            });

            return updated;
        });

        return {
            ...updatedBooking,
            absensi_link: absensiData ? absensiData.link_absensi : (updatedBooking.Absensi?.link_absensi || null)
        };
    },

    // user
    async getAllPeminjaman({ page = 1, size = 10, userId, status }) {
        const pageNum = Number(page);
        const sizeNum = Number(size);

        const skip = (pageNum - 1) * sizeNum;

        let where = {};
        where.pengguna_id = userId;



        if (status) {
            where.status = status;
        }

        const totalRows = await prisma.peminjaman.count({
            where
        });

        const data = await prisma.peminjaman.findMany({
            skip: skip,
            take: sizeNum,
            where,
            include: {
                Pengguna: {
                    select: {
                        nama_lengkap: true,
                        email: true,
                        DetailPengguna: {
                            select: {
                                tim_kerja: {
                                    select: {
                                        code: true,
                                        nama_tim_kerja: true
                                    }
                                }

                            }
                        }

                    }

                },
                RuangRapat: true,
                Absensi: {
                    select: {
                        link_absensi: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalPages = Math.ceil(totalRows / sizeNum);


        return {
            data,
            pagination: {
                page: pageNum,
                size: sizeNum,
                total_rows: totalRows,
                total_pages: totalPages
            }
        };
    },


    // admin
    async getPeminjamanRiwayat({
        page = 1,
        size = 10,
        ruangRapatId,
        tanggalMulai,
        tanggalAkhir,
        status
    }) {
        try {
            const pageNum = Math.max(1, Number(page));
            const sizeNum = Math.max(1, Number(size));
            const skip = (pageNum - 1) * sizeNum;

            let where = {};

            if (status) {
                where.status = status;
            } else {
                where.NOT = {
                    status: 'DIPROSES'
                };
            }

            if (ruangRapatId) {
                where.ruang_rapat_id = ruangRapatId;
            }

            if (tanggalMulai) {
                if (tanggalAkhir) {
                    where.tanggal_mulai = {
                        gte: tanggalMulai,
                        lte: tanggalAkhir
                    };
                } else {
                    where.tanggal_mulai = {
                        equals: tanggalMulai
                    };
                }
            }

            const totalRows = await prisma.peminjaman.count({ where });

            const data = await prisma.peminjaman.findMany({
                skip,
                take: sizeNum,
                where,
                include: {
                    Pengguna: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            email: true,
                            DetailPengguna: {
                                include: {
                                    tim_kerja: true
                                }
                            }
                        }
                    },
                    RuangRapat: true
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });


            return {
                data,
                pagination: {
                    page: pageNum,
                    size: sizeNum,
                    total_rows: totalRows,
                    total_pages: Math.ceil(totalRows / sizeNum)
                }
            };
        } catch (error) {
            throw new ResponseError(500, 'Failed to get peminjaman');
        }
    },

    async getAjuanPeminjaman({
        page = 1,
        size = 10,
        ruangRapatId,
        tanggalMulai,
        tanggalAkhir,

    }) {
        try {
            const pageNum = Math.max(1, Number(page));
            const sizeNum = Math.max(1, Number(size));
            const skip = (pageNum - 1) * sizeNum;

            let where = {
                status: 'DIPROSES'
            };

            if (ruangRapatId) {
                where.ruang_rapat_id = ruangRapatId;
            }

            if (tanggalMulai) {
                if (tanggalAkhir) {
                    where.tanggal_mulai = {
                        gte: tanggalMulai,
                        lte: tanggalAkhir
                    };
                } else {
                    where.tanggal_mulai = {
                        equals: tanggalMulai
                    };
                }
            }

            const totalRows = await prisma.peminjaman.count({ where });

            const data = await prisma.peminjaman.findMany({
                skip,
                take: sizeNum,
                where,
                include: {
                    Pengguna: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            email: true,
                            DetailPengguna: {
                                include: {
                                    tim_kerja: true
                                }
                            }
                        }
                    },
                    RuangRapat: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return {
                data,
                pagination: {
                    page: pageNum,
                    size: sizeNum,
                    total_rows: totalRows,
                    total_pages: Math.ceil(totalRows / sizeNum)
                }
            };
        } catch (error) {
            throw new ResponseError(500, 'Failed to get peminjaman diproses');
        }
    },

    async getPeminjamanById(userId, peminjamanId, role) {
        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id: peminjamanId },
            include: {
                Pengguna: {
                    select: {
                        nama_lengkap: true,
                        email: true,
                        DetailPengguna: {
                            select: {
                                tim_kerja: true
                            }
                        }
                    }
                },
                RuangRapat: true
            }
        });

        if (!peminjaman) {
            throw new ResponseError(404, "Booking not found");
        }

        if (role === 'PEMINJAM' && peminjaman.pengguna_id !== userId) {
            throw new ResponseError(403, "Access denied");
        }

        return peminjaman;
    },

    async getRuanganStatistics({ tanggalMulai, tanggalAkhir }) {
        try {

            let where = {
                status: "SELESAI"
            };

            if (tanggalMulai) {
                if (tanggalAkhir) {
                    where.tanggal_mulai = {
                        gte: tanggalMulai,
                        lte: tanggalAkhir
                    };
                } else {
                    where.tanggal_mulai = {
                        equals: tanggalMulai
                    };
                }
            }

            const ruangStats = await prisma.ruangRapat.findMany({
                select: {
                    id: true,
                    nama_ruangan: true,
                    _count: {
                        select: {
                            peminjaman: {
                                where: where
                            }
                        }
                    }
                }
            });

            const formattedData = ruangStats.map(ruang => ({
                ruangan: ruang.nama_ruangan,
                jumlah_peminjaman: ruang._count.peminjaman
            }));

            return formattedData

        } catch (error) {
            throw new ResponseError(500, 'Failed to get ruangan statistics');
        }
    },

    async checkAvailability(data) {
        try {
            // 1. Cek hari libur
            const today = new Date();
            const tanggal_cuti = await axios.get(process.env.API_DAY_OFF);
            const formattedToday = today.toISOString().split('T')[0];


            if (data.tanggal === formattedToday) {
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                const currentTimeInMinutes = (currentHour * 60) + currentMinute;

                const requestedTimeInMinutes = convertTimeToMinutes(data.jam);

                if (requestedTimeInMinutes <= currentTimeInMinutes) {
                    return {
                        tanggal: data.tanggal,
                        jam: data.jam,
                        jumlah_ruangan_tersedia: 0,
                        ruangan_tersedia: [],
                        message: "Tidak dapat melakukan peminjaman untuk waktu yang sudah lewat"
                    };
                }
            }
            // Validasi untuk tanggal yang dipilih
            const is_tanggal_cuti = tanggal_cuti.data.find((date) =>
                date.tanggal === data.tanggal
            );

            if (is_tanggal_cuti) {
                const keterangan = is_tanggal_cuti.is_cuti ? 'cuti bersama' : 'hari libur';
                throw new ResponseError(400, `Tidak bisa melakukan peminjaman pada ${keterangan}: ${is_tanggal_cuti.keterangan}`);
            }

            // 2. Ambil semua ruangan
            const allRooms = await prisma.ruangRapat.findMany();

            // 3. Ambil semua booking pada tanggal tersebut
            const bookings = await prisma.peminjaman.findMany({
                where: {
                    OR: [
                        { tanggal_mulai: data.tanggal },
                        { tanggal_selesai: data.tanggal },
                        {
                            AND: [
                                { tanggal_mulai: { lte: data.tanggal } },
                                {
                                    OR: [
                                        { tanggal_selesai: { gte: data.tanggal } },
                                        { tanggal_selesai: null }
                                    ]
                                }
                            ]
                        }
                    ],
                    status: {
                        in: ['DIPROSES', 'DISETUJUI']
                    }
                },

                select: {
                    ruang_rapat_id: true,
                    jam_mulai: true,
                    jam_selesai: true
                },

            });


            // 4. Cek ketersediaan untuk setiap ruangan
            const availableRooms = allRooms.filter(room => {
                const roomBookings = bookings.filter(
                    booking => booking.ruang_rapat_id === room.id
                );

                // Konversi jam input ke menit untuk perbandingan yang lebih akurat
                const requestedTime = convertTimeToMinutes(data.jam);

                // Cek apakah ada booking yang overlap dengan jam yang diminta
                const hasConflict = roomBookings.some(booking => {
                    const startTime = convertTimeToMinutes(booking.jam_mulai);
                    const endTime = convertTimeToMinutes(booking.jam_selesai);

                    // Jam yang diminta tidak boleh:
                    // 1. Sama dengan jam mulai booking
                    // 2. Sama dengan jam selesai booking
                    // 3. Berada di antara jam mulai dan selesai booking
                    return requestedTime === startTime || // Cek sama dengan jam mulai
                        requestedTime === endTime ||   // Cek sama dengan jam selesai
                        (requestedTime > startTime && requestedTime < endTime); // Cek di antara rentang
                });

                return !hasConflict;
            });

            // 5. Format response
            const formattedResponse = availableRooms.map(room => ({
                id: room.id,
                nama_ruangan: room.nama_ruangan,
                kapasitas: room.kapasitas,
                lokasi: room.lokasi_ruangan,
                deskripsi: room.deskripsi,
                foto_ruangan: room.foto_ruangan
            })).sort((a, b) => a.nama_ruangan.localeCompare(b.nama_ruangan));


            return {
                tanggal: data.tanggal,
                jam: data.jam,
                jumlah_ruangan_tersedia: formattedResponse.length,
                ruangan_tersedia: formattedResponse
            };

        } catch (error) {
            throw error;
        }
    },

    async countStatus() {
        try {
            const diproses = await prisma.peminjaman.count({
                where: {
                    status: 'DIPROSES'
                }
            });

            const disetujui = await prisma.peminjaman.count({
                where: {
                    status: 'DISETUJUI'
                }
            });

            const ditolak = await prisma.peminjaman.count({
                where: {
                    status: 'DITOLAK'
                }
            });

            const selesai = await prisma.peminjaman.count({
                where: {
                    status: 'SELESAI'
                }
            });

            return {
                DIPROSES: diproses,
                DISETUJUI: disetujui,
                DITOLAK: ditolak,
                SELESAI: selesai
            };

        } catch (error) {
            throw new Error(`Error counting status: ${error.message}`);
        }
    }


};

module.exports = peminjamanService;