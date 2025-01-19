const { validate } = require('../utils/validation');
const absensiService = require("../services/absensi.service")
const absensiValidation = require("../validations/absensi.validation")


const absensiController ={
    async getAbsensiDetail(req, res, next) {
        try {
            const { kode } = req.params;
            
            const result = await absensiService.getAbsensiDetail(kode);
            
            res.status(200).json({
                status: true,
                message: "Success get absensi detail",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async submitAbsensi(req, res, next) {
        try {
            const { kode } = req.params;
            const validatedData = validate(absensiValidation.create_absensi, req.body);
            
            const result = await absensiService.submitAbsensi(kode, validatedData);
            
            res.status(201).json({
                status: true,
                message: "Success submit absensi",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getListAbsensi(req, res, next) {
        try {
            const { kode } = req.params;
            
            const result = await absensiService.getListAbsensi(kode);
            
            res.status(200).json({
                status: true,
                message: "Success get list absensi",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = absensiController

