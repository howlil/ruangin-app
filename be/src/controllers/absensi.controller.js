const { validate } = require('../utils/validation');
const absensiService = require("../services/absensi.service")
const absensiValidation = require("../validations/absensi.validation")


const absensiController = {
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
    },

    async exportAbsensiToPdf(req, res, next) {
        try {
            const { kode } = req.params;
            const doc = await absensiService.exportAbsensiToPdf(kode);

            const fileName = `daftar-hadir-${kode}.pdf`;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            doc.pipe(res);
            doc.end();
        } catch (error) {
            next(error);
        }
    },
    async downloadAbsensiXlsx(req, res, next) {
        try {
            const { kode } = req.params;
            const workbook = await absensiService.exportAbsensiToXlsx(kode);
            
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=daftar-hadir-${kode}.xlsx`);
            
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = absensiController

