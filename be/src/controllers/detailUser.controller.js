const detailUserService = require('../services/detailUser.service');


const detailUserController = {
    async createTimKerja(req, res, next) {
        try {
            const data = req.body
            const result = await detailUserService.createTimKerja(data);
            
            res.status(201).json({
                status: true,
                message: "TimKerja created successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllTimKerja(req, res, next) {
        try {
            const result = await detailUserService.getAllTimKerja();
            
            res.status(200).json({
                status: true,
                message: "Get all divisi successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getTimKerjaById(req, res, next) {
        try {
            const result = await detailUserService.getTimKerjaById(req.params.id);
            
            res.status(200).json({
                status: true,
                message: "Get divisi successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateTimKerja(req, res, next) {
        try {
            const data = req.body
            const result = await detailUserService.updateTimKerja(req.params.id, data);
            
            res.status(200).json({
                status: true,
                message: "TimKerja updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteTimKerja(req, res, next) {
        try {
            const result = await detailUserService.deleteTimKerja(req.params.id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

   
};

module.exports = detailUserController;
