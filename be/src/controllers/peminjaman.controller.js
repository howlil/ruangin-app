const { validate } = require('../utils/validation');
const peminjamanService = require('../services/peminjaman.service');
const peminjamanValidation = require('../validations/peminjaman.validation');

const peminjamanController = {
    async createPeminjaman(req, res, next) {
        try {
            const data = validate(peminjamanValidation.createPeminjaman, req.body);
            const result = await peminjamanService.createPeminjaman(req.user.id, data);

            res.status(201).json({
                status: true,
                message: "Booking created successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req, res, next) {
        try {
            const validatedData = validate(peminjamanValidation.updateStatus, req.body);

            const result = await peminjamanService.updateStatus(
                req.user.id,
                req.params.peminjamanId,
                validatedData
            );

            const statusMessage = result.status.toLowerCase();

            res.status(200).json({
                status: true,
                message: `Booking ${statusMessage} successfully`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },
    async getAllPeminjaman(req, res, next) {
        try {
            const { page, size, status } = req.query;
            const { id: userId } = req.user;
            const result = await peminjamanService.getAllPeminjaman({
                page,
                size,
                userId,
                status
            });

            res.status(200).json({
                status: true,
                message: "Get all bookings successful",
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },


    async getPeminjamanRiwayat(req, res, next) {
        try {
            const {
                page,
                size,
                ruangRapatId,
                tanggalMulai,
                tanggalAkhir,
                status
            } = req.query;

            const result = await peminjamanService.getPeminjamanRiwayat({
                page,
                size,
                ruangRapatId,
                tanggalMulai,
                tanggalAkhir,
                status
            });

            res.status(200).json({
                status: true,
                message: "Get peminjaman diproses successful",
                data: result.data,
                pagination: result.pagination
            });

        } catch (error) {
            next(error);
        }
    },
    async getAjuanPeminjaman(req, res, next) {
        try {
            const {
                page,
                size,
                ruangRapatId,
                tanggalMulai,
                tanggalAkhir,
            } = req.query;

            const result = await peminjamanService.getAjuanPeminjaman({
                page,
                size,
                ruangRapatId,
                tanggalMulai,
                tanggalAkhir,
            });

            res.status(200).json({
                status: true,
                message: "Get peminjaman diproses successful",
                data: result.data,
                pagination: result.pagination
            });

        } catch (error) {
            next(error);
        }
    },

    async getPeminjamanById(req, res, next) {
        try {
            const result = await peminjamanService.getPeminjamanById(
                req.user.id,
                req.params.peminjamanId,
                req.user.role
            );

            res.status(200).json({
                status: true,
                message: "Get booking successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getRuanganStatistics(req, res, next) {
        try {
            const { tanggalMulai, tanggalAkhir } = req.query;

            const result = await peminjamanService.getRuanganStatistics({
                tanggalMulai,
                tanggalAkhir
            });

            res.status(200).json({
                status: true,
                message: "Statistics data retrieved successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async checkAvailability(req, res, next) {
        try {
            const validated = validate(peminjamanValidation.checkAvailability, req.body)

            const result = await peminjamanService.checkAvailability(validated)

            res.status(200).json({
                status: true,
                message: 'Berhasil mengecek ketersediaan ruangan',
                data: result,
            });
        } catch (error) {
            next(error)
        }
    }
};

module.exports = peminjamanController;