const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js')

const detailUserService = {
    async createTimKerja(data) {
        const existingTimKerja = await prisma.timKerja.findFirst({
            where: {
                nama_tim_kerja: data.nama_tim_kerja
            }
        });

        if (existingTimKerja) {
            throw new ResponseError(400, "Data Sudah Ada");
        }

        const existingCode = await prisma.timKerja.findUnique({
            where: {
                code: data.code
            }
        });

        if (existingCode) {
            throw new ResponseError(400, "Kode Tim Kerja Sudah Digunakan");
        }

        const isAktif = data.is_aktif.toLowerCase() === 'true';

        const result = await prisma.timKerja.create({
            data: {
                nama_tim_kerja: data.nama_tim_kerja,
                code: data.code,
                is_aktif: isAktif
            }
        });

        return result;
    },
    async getAllTimKerja({ page = 1, size = 10 }) {
        const pageNum = Number(page);
        const sizeNum = Number(size);
        const skip = (pageNum - 1) * sizeNum;

        const totalRows = await prisma.timKerja.count();

        const data = await prisma.timKerja.findMany({
            skip: skip,
            take: sizeNum,
            include: {
                detail_pengguna: {
                    include: {
                        Pengguna: {
                            select: {
                                nama_lengkap: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                }
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

    async getTimKerjaById(id) {
        const timKerja = await prisma.timKerja.findUnique({
            where: { id },
            include: {
                detail_pengguna: {
                    include: {
                        Pengguna: {
                            select: {
                                nama_lengkap: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                }
            }
        });

        if (!timKerja) {
            throw new ResponseError(404, "Data Tidak Ditemukan");
        }

        return timKerja;
    },

    async updateTimKerja(id, data) {
        const existingTimKerja = await prisma.timKerja.findUnique({
            where: { id }
        });
    
        if (!existingTimKerja) {
            throw new ResponseError(404, "Data Tidak Ditemukan");
        }
    
        if (Object.keys(data).length === 1 && data.is_aktif) {
            const result = await prisma.timKerja.update({
                where: { id },
                data: {
                    is_aktif: data.is_aktif.toLowerCase() === 'true'
                }
            });
            return result;
        }
    
        if (data.nama_tim_kerja) {
            const duplicateNama = await prisma.timKerja.findFirst({
                where: {
                    nama_tim_kerja: data.nama_tim_kerja,
                    NOT: { id }
                }
            });
    
            if (duplicateNama) {
                throw new ResponseError(400, "Nama Tim Kerja Sudah Digunakan");
            }
        }
    
        if (data.code) {
            const duplicateCode = await prisma.timKerja.findFirst({
                where: {
                    code: data.code,
                    NOT: { id }
                }
            });
    
            if (duplicateCode) {
                throw new ResponseError(400, "Kode Tim Kerja Sudah Digunakan");
            }
        }
    
        const updateData = {};
        if (data.nama_tim_kerja) updateData.nama_tim_kerja = data.nama_tim_kerja;
        if (data.code) updateData.code = data.code;
        if (data.is_aktif) updateData.is_aktif = data.is_aktif.toLowerCase() === 'true';
    
        const result = await prisma.timKerja.update({
            where: { id },
            data: updateData
        });
    
        return result;
    },

    async deleteTimKerja(id) {
        const timKerja = await prisma.timKerja.findUnique({
            where: { id },
            include: {
                detail_pengguna: true
            }
        });

        if (!timKerja) {
            throw new ResponseError(404, "Data not found");
        }

        if (timKerja.detail_pengguna.length > 0) {
            throw new ResponseError(400, "Cannot delete timKerja with active users");
        }

        await prisma.timKerja.delete({
            where: { id }
        });

        return {
            status: true,
            message: "Data deleted successfully"
        };
    },


};

module.exports = detailUserService;