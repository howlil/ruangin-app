const { validate } = require('../utils/validation');
const ruangRapatService = require('../services/ruangRapat.service');
const ruangRapatValidation = require('../validations/ruangRapat.validation');
const { ResponseError } = require('../utils/responseError');

const ruangRapatController = {
    async createRuangRapat(req, res, next) {
        try {
            if (!req.file) {
                throw new ResponseError(400, "Room image is required");
            }

            const data = validate(ruangRapatValidation.createRuangRapat, req.body);
            const result = await ruangRapatService.createRuangRapat(data, req.file);
            
            res.status(201).json({
                status: true,
                message: "Room created successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllRuangRapat(req, res, next) {
        try {
            const { page, size,status,month } = req.query;

            const result = await ruangRapatService.getAllRuangRapat({
                page,
                size,
                status,
                month
            });            
            res.status(200).json({
                status: true,
                message: "Get all rooms successful",
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    },

    async getRuangRapatById(req, res, next) {
        try {
            const result = await ruangRapatService.getRuangRapatById(req.params.id);
            
            res.status(200).json({
                status: true,
                message: "Get room successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateRuangRapat(req, res, next) {
        try {
            const data = validate(ruangRapatValidation.updateRuangRapat, req.body);
            const result = await ruangRapatService.updateRuangRapat(req.params.id, data, req.file);
            
            res.status(200).json({
                status: true,
                message: "Room updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteRuangRapat(req, res, next) {
        try {
            const result = await ruangRapatService.deleteRuangRapat(req.params.id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async getTodayPeminjaman(req, res, next) {
        try {
            const result = await ruangRapatService.getTodayPeminjaman();
            
            
            res.status(200).json({
                error: false,
                message: "Get today's bookings successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ruangRapatController;