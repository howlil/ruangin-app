const Joi = require('joi');

module.exports = {
    createRuangRapat: Joi.object({
        nama_ruangan: Joi.string().required(),
        deskripsi: Joi.string().required(),
        lokasi_ruangan: Joi.string().required(),
    }),
    
    updateRuangRapat: Joi.object({
        nama_ruangan: Joi.string().optional(),
        deskripsi: Joi.string().optional(),
        lokasi_ruangan: Joi.string().optional(),
    })
};