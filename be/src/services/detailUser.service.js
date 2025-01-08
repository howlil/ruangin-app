const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js')

const detailUserService = {
    async createTimKerja(data) {
        const existingTimKerja = await prisma.timKerja.findFirst({
            where: { nama_tim_kerja: data.nama_tim_kerja }
        });

        if (existingTimKerja) {
            throw new ResponseError(400, "Data Sudah Ada");
        }

        const result = await prisma.timKerja.create({
            data: {
                ...data
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

        // Check for duplicate name
        const duplicateTimKerja = await prisma.timKerja.findFirst({
            where: {
                ...data,
                NOT: { id }
            }
        });

        if (duplicateTimKerja) {
            throw new ResponseError(400, "Nama Data Sudah Ada");
        }

        const result = await prisma.timKerja.update({
            where: { id },
            data: {
                ...data,
            }
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