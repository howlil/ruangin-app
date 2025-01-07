const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js');
const moment = require('moment');

const peminjamanService = {
    async createPeminjaman(userId, data) {
        // Validate user role
        const user = await prisma.pengguna.findUnique({
            where: { id: userId },
            include: {
                DetailPengguna: true
            }
        });

        if (user.role !== 'PEMINJAM' && user.role !== 'ADMIN') {
            throw new ResponseError(403, "Only PEMINJAM and ADMIN can create booking");
        }

        if (user.role === 'PEMINJAM' && !user.DetailPengguna) {
            throw new ResponseError(400, "User details not found");
        }

        // Validate room existence
        const room = await prisma.ruangRapat.findUnique({
            where: { id: data.ruang_rapat_id }
        });

        if (!room) {
            throw new ResponseError(404, "Room not found");
        }

        // Validate date and time
        const now = moment();
        const bookingDate = moment(data.tanggal);
        const bookingStart = moment(`${data.tanggal} ${data.jam_mulai}`);
        const bookingEnd = moment(`${data.tanggal} ${data.jam_selesai}`);

        if (bookingDate.isBefore(now, 'day')) {
            throw new ResponseError(400, "Cannot book for past dates");
        }

        if (bookingStart.isBefore(now)) {
            throw new ResponseError(400, "Cannot book for past time");
        }

        if (bookingEnd.isSameOrBefore(bookingStart)) {
            throw new ResponseError(400, "End time must be after start time");
        }

        // Check for booking conflicts
        const existingBookings = await prisma.peminjaman.findMany({
            where: {
                ruang_rapat_id: data.ruang_rapat_id,
                tanggal: data.tanggal,
                status: {
                    in: ['DIPROSES', 'DISETUJUI']
                }
            }
        });

        const hasConflict = existingBookings.some(booking => {
            const existingStart = moment(`${booking.tanggal} ${booking.jam_mulai}`);
            const existingEnd = moment(`${booking.tanggal} ${booking.jam_selesai}`);

            return (bookingStart.isBetween(existingStart, existingEnd, undefined, '[]') ||
                bookingEnd.isBetween(existingStart, existingEnd, undefined, '[]') ||
                existingStart.isBetween(bookingStart, bookingEnd, undefined, '[]') ||
                existingEnd.isBetween(bookingStart, bookingEnd, undefined, '[]'));
        });

        if (hasConflict) {
            throw new ResponseError(400, "Room is already booked for this time period");
        }

        // Create booking
        const result = await prisma.peminjaman.create({
            data: {
                pengguna_id: userId,
                ruang_rapat_id: data.ruang_rapat_id,
                nama_kegiatan: data.nama_kegiatan,
                tanggal: data.tanggal,
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
        const user = await prisma.pengguna.findUnique({
            where: { id: userId }
        });
    
        if (user.role !== 'ADMIN') {
            throw new ResponseError(403, "Only ADMIN can update bookings");
        }
    
        const booking = await prisma.peminjaman.findUnique({
            where: { id: peminjamanId },
            include: {
                RuangRapat: true
            }
        });
    
        if (!booking) {
            throw new ResponseError(404, "Booking not found");
        }
    
        // Perbaikan validasi status
        if (!['DIPROSES', 'DISETUJUI'].includes(booking.status)) {
            throw new ResponseError(400, `Cannot update booking with status ${booking.status}. Only DIPROSES and DISETUJUI status can be updated`);
        }
    
        // Jika ada perubahan ruangan atau waktu, cek konflik jadwal
        if (updateData.ruang_rapat_id || updateData.tanggal || updateData.jam_mulai || updateData.jam_selesai) {
            const bookingStart = moment(`${updateData.tanggal || booking.tanggal} ${updateData.jam_mulai || booking.jam_mulai}`);
            const bookingEnd = moment(`${updateData.tanggal || booking.tanggal} ${updateData.jam_selesai || booking.jam_selesai}`);
    
            // Validasi waktu sekarang jika mengubah jadwal
            const now = moment();
            if (bookingStart.isBefore(now)) {
                throw new ResponseError(400, "Cannot update to past time");
            }
    
            const existingBookings = await prisma.peminjaman.findMany({
                where: {
                    ruang_rapat_id: updateData.ruang_rapat_id || booking.ruang_rapat_id,
                    tanggal: updateData.tanggal || booking.tanggal,
                    status: {
                        in: ['DIPROSES', 'DISETUJUI']
                    },
                    NOT: {
                        id: peminjamanId
                    }
                }
            });
    
            const hasConflict = existingBookings.some(existing => {
                const existingStart = moment(`${existing.tanggal} ${existing.jam_mulai}`);
                const existingEnd = moment(`${existing.tanggal} ${existing.jam_selesai}`);
    
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
    
        // Update peminjaman
        const updatedBooking = await prisma.peminjaman.update({
            where: { id: peminjamanId },
            data: {
                ...updateData,
                // Reset alasan penolakan jika status bukan DITOLAK
                alasan_penolakan: updateData.status === 'DITOLAK' ? updateData.alasan_penolakan : null
            },
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
                RuangRapat: true
            }
        });
    
        return updatedBooking;
    },

    async getAllPeminjaman(userId, role) {
        let where = {};

        if (role === 'PEMINJAM') {
            where.pengguna_id = userId;
        }

        const result = await prisma.peminjaman.findMany({
            where,
            include: {
                Pengguna: {
                    select: {
                        nama_lengkap: true,
                        email: true
                    }
                },
                RuangRapat: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return result;
    },

    async getPeminjamanById(userId, peminjamanId, role) {
        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id: peminjamanId },
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

        if (!peminjaman) {
            throw new ResponseError(404, "Booking not found");
        }

        if (role === 'PEMINJAM' && peminjaman.pengguna_id !== userId) {
            throw new ResponseError(403, "Access denied");
        }

        return peminjaman;
    }
};

module.exports = peminjamanService;