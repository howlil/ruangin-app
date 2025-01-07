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
            const result = await peminjamanService.getAllPeminjaman(
                req.user.id,
                req.user.role
            );

            res.status(200).json({
                status: true,
                message: "Get all bookings successful",
                data: result
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
    }
};

module.exports = peminjamanController;