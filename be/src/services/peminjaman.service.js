const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js');
const moment = require('moment');

const peminjamanService = {
    async createPeminjaman(userId, data) {
        // Validate user role
        const user = await prisma.pengguna.findUnique({
            where: { id: userId }
        });

        if (user.role !== 'PEMINJAM') {
            throw new ResponseError(403, "Only PEMINJAM can create booking");
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

    async updateStatus(userId, peminjamanId, status) {
        const user = await prisma.pengguna.findUnique({
            where: { id: userId }
        });

        if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
            throw new ResponseError(403, "Only ADMIN can approve/reject bookings");
        }

        // Validate booking existence
        const booking = await prisma.peminjaman.findUnique({
            where: { id: peminjamanId },
            include: {
                RuangRapat: true
            }
        });

        if (!booking) {
            throw new ResponseError(404, "Booking not found");
        }

        if (booking.status !== 'DIPROSES') {
            throw new ResponseError(400, `Cannot update status. Current status is ${booking.status}`);
        }

        // Update status
        const result = await prisma.peminjaman.update({
            where: { id: peminjamanId },
            data: { status },
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