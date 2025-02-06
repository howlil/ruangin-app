const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require("../apps/logging.js")

const ruangRapatService = {
    async createRuangRapat(data, file) {
        const existingRoom = await prisma.ruangRapat.findFirst({
            where: { nama_ruangan: data.nama_ruangan }
        });

        if (existingRoom) {
            if (file) {
                await fs.unlink(file.path);
            }
            throw new ResponseError(400, "Room name already exists");
        }

        const result = await prisma.ruangRapat.create({
            data: {
                nama_ruangan: data.nama_ruangan,
                deskripsi: data.deskripsi,
                lokasi_ruangan: data.lokasi_ruangan,
                kapasitas: data.kapasitas,
                foto_ruangan: file ? `/images/${file.filename}` : null
            }
        });

        return result;
    },

    async getAllRuangRapat({ page = 1, size = 10, status, month }) {
        const pageNum = Number(page);
        const sizeNum = Number(size);
        const skip = (pageNum - 1) * sizeNum;

        let peminjamanFilter = {};

        if (status) {
            peminjamanFilter.status = status;
        }

        if (month) {
            // Asumsi format month adalah "YYYY-MM"
            const [year, monthNum] = month.split('-');
            const nextMonth = monthNum === '12'
                ? `${Number(year) + 1}-01`
                : `${year}-${String(Number(monthNum) + 1).padStart(2, '0')}`;

            peminjamanFilter.OR = [
                // Kasus 1: tanggal_mulai dalam bulan yang dipilih
                {
                    AND: [
                        { tanggal_mulai: { startsWith: month } },
                    ]
                },
                // Kasus 2: tanggal_selesai dalam bulan yang dipilih
                {
                    AND: [
                        { tanggal_selesai: { startsWith: month } },
                    ]
                },
                // Kasus 3: rentang waktu mencakup seluruh bulan
                {
                    AND: [
                        { tanggal_mulai: { lt: `${month}-01` } },
                        {
                            OR: [
                                { tanggal_selesai: { gte: nextMonth } },
                                { tanggal_selesai: null }
                            ]
                        }
                    ]
                }
            ];
        }

        const where = {
            ...(Object.keys(peminjamanFilter).length > 0 && {
                peminjaman: {
                    some: peminjamanFilter
                }
            })
        };

        const totalRows = await prisma.ruangRapat.count({
            where
        });

        const data = await prisma.ruangRapat.findMany({
            where,
            skip: skip,
            take: sizeNum,
            include: {
                peminjaman: {
                    where: peminjamanFilter,
                    select: {
                        id: true,
                        nama_kegiatan: true,
                        no_surat_peminjaman: true,
                        tanggal_mulai: true,
                        tanggal_selesai: true,
                        jam_mulai: true,
                        jam_selesai: true,
                        status: true,
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
                        }
                    },
                    orderBy: [
                        { tanggal_mulai: 'asc' },
                        { jam_mulai: 'asc' }
                    ]
                }
            },
            orderBy: {
                createdAt: 'asc'
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

    async getRuangRapatById(id) {
        const ruangRapat = await prisma.ruangRapat.findUnique({
            where: { id },
            include: {
                peminjaman: {
                    select: {
                        id: true,
                        nama_kegiatan: true,
                        tanggal_mulai: true,
                        tanggal_selesai: true,
                        jam_mulai: true,
                        jam_selesai: true,
                        status: true,
                        Pengguna: {
                            select: {
                                nama_lengkap: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!ruangRapat) {
            throw new ResponseError(404, "Room not found");
        }

        return ruangRapat;
    },

    async updateRuangRapat(id, data, file) {
        const ruangRapat = await prisma.ruangRapat.findUnique({
            where: { id }
        });

        if (!ruangRapat) {
            if (file) {
                await fs.unlink(file.path);
            }
            throw new ResponseError(404, "Room not found");
        }

        if (data.nama_ruangan) {
            const existingRoom = await prisma.ruangRapat.findFirst({
                where: {
                    nama_ruangan: data.nama_ruangan,
                    NOT: { id }
                }
            });

            if (existingRoom) {
                if (file) {
                    await fs.unlink(file.path);
                }
                throw new ResponseError(400, "Room name already exists");
            }
        }

        if (file && ruangRapat.foto_ruangan) {
            const oldImagePath = path.join(__dirname, '../../public', ruangRapat.foto_ruangan);
            try {
                await fs.unlink(oldImagePath);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        // Update data - pastikan kapasitas tetap string
        const result = await prisma.ruangRapat.update({
            where: { id },
            data: {
                nama_ruangan: data.nama_ruangan || ruangRapat.nama_ruangan,
                deskripsi: data.deskripsi || ruangRapat.deskripsi,
                lokasi_ruangan: data.lokasi_ruangan || ruangRapat.lokasi_ruangan,
                kapasitas: data.kapasitas ? String(data.kapasitas) : ruangRapat.kapasitas, // Konversi ke string
                foto_ruangan: file ? `/images/${file.filename}` : ruangRapat.foto_ruangan
            }
        });

        return result;
    },

    async deleteRuangRapat(id) {
        const ruangRapat = await prisma.ruangRapat.findUnique({
            where: { id },
            include: {
                peminjaman: {
                    where: {
                        status: {
                            in: ['DIPROSES', 'DISETUJUI']
                        }
                    }
                }
            }
        });

        if (!ruangRapat) {
            throw new ResponseError(404, "Room not found");
        }

        if (ruangRapat.peminjaman.length > 0) {
            throw new ResponseError(400, "Cannot delete room with active bookings");
        }

        if (ruangRapat.foto_ruangan) {
            const imagePath = path.join(__dirname, '../../public', ruangRapat.foto_ruangan);
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await prisma.ruangRapat.delete({
            where: { id }
        });

        return {
            status: true,
            message: "Room deleted successfully"
        };
    },
    async getTodayPeminjaman() {
        const today = new Date().toISOString().split('T')[0];
        logger.info(`Fetching peminjaman for date: ${today}`);

        const ruangRapat = await prisma.ruangRapat.findMany({
            select: {
                id: true,
                nama_ruangan: true,
                peminjaman: {
                    where: {
                        tanggal_mulai: today,
                        status: 'DISETUJUI'
                    },
                    select: {
                        nama_kegiatan: true,
                        jam_mulai: true,
                        jam_selesai: true,
                        Pengguna: {
                            select: {
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
                        }
                    },
                    orderBy: {
                        jam_mulai: 'asc'
                    }
                }
            }
        });

        const formattedData = ruangRapat
            .filter(room => room.peminjaman.length > 0)
            .map(room => ({
                ruang_rapat: room.nama_ruangan,
                jadwal: room.peminjaman.map(booking => ({
                    nama_kegiatan: booking.nama_kegiatan,
                    jam_mulai: booking.jam_mulai,
                    jam_selesai: booking.jam_selesai,
                    tim_kerja: booking.Pengguna?.DetailPengguna?.tim_kerja ? {
                        code: booking.Pengguna.DetailPengguna.tim_kerja.code,
                        nama: booking.Pengguna.DetailPengguna.tim_kerja.nama_tim_kerja
                    } : null
                }))
            }));

        return formattedData;


    }
};


module.exports = ruangRapatService;