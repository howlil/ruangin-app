const { validate } = require('../utils/validation');
const divisiJabatanService = require('../services/detailUser.service');
const divisiJabatanValidation = require('../validations/detailUser.validation');


const detailUserController = {
    async createDivisi(req, res, next) {
        try {
            const data = req.body
            const result = await divisiJabatanService.createDivisi(data);
            
            res.status(201).json({
                status: true,
                message: "Divisi created successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllDivisi(req, res, next) {
        try {
            const result = await divisiJabatanService.getAllDivisi();
            
            res.status(200).json({
                status: true,
                message: "Get all divisi successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getDivisiById(req, res, next) {
        try {
            const result = await divisiJabatanService.getDivisiById(req.params.id);
            
            res.status(200).json({
                status: true,
                message: "Get divisi successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateDivisi(req, res, next) {
        try {
            const data = req.body
            const result = await divisiJabatanService.updateDivisi(req.params.id, data);
            
            res.status(200).json({
                status: true,
                message: "Divisi updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteDivisi(req, res, next) {
        try {
            const result = await divisiJabatanService.deleteDivisi(req.params.id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    // Jabatan Controllers
    async createJabatan(req, res, next) {
        try {
            const data =req.body;
            const result = await divisiJabatanService.createJabatan(data);
            
            res.status(201).json({
                status: true,
                message: "Jabatan created successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllJabatan(req, res, next) {
        try {
            const result = await divisiJabatanService.getAllJabatan();
            
            res.status(200).json({
                status: true,
                message: "Get all jabatan successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getJabatanById(req, res, next) {
        try {
            const result = await divisiJabatanService.getJabatanById(req.params.id);
            
            res.status(200).json({
                status: true,
                message: "Get jabatan successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateJabatan(req, res, next) {
        try {
            const data =req.body;
            const result = await divisiJabatanService.updateJabatan(req.params.id, data);
            
            res.status(200).json({
                status: true,
                message: "Jabatan updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteJabatan(req, res, next) {
        try {
            const result = await divisiJabatanService.deleteJabatan(req.params.id);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = detailUserController;
