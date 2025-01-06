const { ResponseError } = require('../utils/responseError');
const prisma = require('../configs/db.js')

const detailUserService = {
    async createDivisi(data) {
        const existingDivisi = await prisma.divisi.findFirst({
            where: { nama_divisi: data.nama_divisi }
        });

        if (existingDivisi) {
            throw new ResponseError(400, "Divisi already exists");
        }

        const result = await prisma.divisi.create({
            data: {
                nama_divisi: data.nama_divisi
            }
        });

        return result;
    },

    async getAllDivisi() {
        const result = await prisma.divisi.findMany({
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

        return result;
    },

    async getDivisiById(id) {
        const divisi = await prisma.divisi.findUnique({
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

        if (!divisi) {
            throw new ResponseError(404, "Divisi not found");
        }

        return divisi;
    },

    async updateDivisi(id, data) {
        const existingDivisi = await prisma.divisi.findUnique({
            where: { id }
        });

        if (!existingDivisi) {
            throw new ResponseError(404, "Divisi not found");
        }

        // Check for duplicate name
        const duplicateDivisi = await prisma.divisi.findFirst({
            where: {
                nama_divisi: data.nama_divisi,
                NOT: { id }
            }
        });

        if (duplicateDivisi) {
            throw new ResponseError(400, "Divisi name already exists");
        }

        const result = await prisma.divisi.update({
            where: { id },
            data: {
                nama_divisi: data.nama_divisi
            }
        });

        return result;
    },

    async deleteDivisi(id) {
        const divisi = await prisma.divisi.findUnique({
            where: { id },
            include: {
                detail_pengguna: true
            }
        });

        if (!divisi) {
            throw new ResponseError(404, "Divisi not found");
        }

        if (divisi.detail_pengguna.length > 0) {
            throw new ResponseError(400, "Cannot delete divisi with active users");
        }

        await prisma.divisi.delete({
            where: { id }
        });

        return {
            status: true,
            message: "Divisi deleted successfully"
        };
    },

    async createJabatan(data) {
        const existingJabatan = await prisma.jabatan.findFirst({
            where: { nama_jabatan: data.nama_jabatan }
        });

        if (existingJabatan) {
            throw new ResponseError(400, "Jabatan already exists");
        }

        const result = await prisma.jabatan.create({
            data: {
                nama_jabatan: data.nama_jabatan
            }
        });

        return result;
    },

    async getAllJabatan() {
        const result = await prisma.jabatan.findMany({
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

        return result;
    },

    async getJabatanById(id) {
        const jabatan = await prisma.jabatan.findUnique({
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

        if (!jabatan) {
            throw new ResponseError(404, "Jabatan not found");
        }

        return jabatan;
    },

    async updateJabatan(id, data) {
        const existingJabatan = await prisma.jabatan.findUnique({
            where: { id }
        });

        if (!existingJabatan) {
            throw new ResponseError(404, "Jabatan not found");
        }

        // Check for duplicate name
        const duplicateJabatan = await prisma.jabatan.findFirst({
            where: {
                nama_jabatan: data.nama_jabatan,
                NOT: { id }
            }
        });

        if (duplicateJabatan) {
            throw new ResponseError(400, "Jabatan name already exists");
        }

        const result = await prisma.jabatan.update({
            where: { id },
            data: {
                nama_jabatan: data.nama_jabatan
            }
        });

        return result;
    },

    async deleteJabatan(id) {
        const jabatan = await prisma.jabatan.findUnique({
            where: { id },
            include: {
                detail_pengguna: true
            }
        });

        if (!jabatan) {
            throw new ResponseError(404, "Jabatan not found");
        }

        if (jabatan.detail_pengguna.length > 0) {
            throw new ResponseError(400, "Cannot delete jabatan with active users");
        }

        await prisma.jabatan.delete({
            where: { id }
        });

        return {
            status: true,
            message: "Jabatan deleted successfully"
        };
    }
};

module.exports = detailUserService;