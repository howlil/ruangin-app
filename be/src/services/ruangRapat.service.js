const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js');
const fs = require('fs').promises;
const path = require('path');

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
            peminjamanFilter.tanggal_mulai = {
                startsWith: month
            };
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
                        tanggal_mulai: 'asc'
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
    }
};


module.exports = ruangRapatService;