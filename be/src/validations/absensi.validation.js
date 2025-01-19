const Joi = require('joi')
module.exports = {
    create_absensi: Joi.object({  
        nama: Joi.string().required(),
        unit_kerja: Joi.string().required(),
        golongan: Joi.string().required(),
        jabatan: Joi.string().required(),
        tanda_tangan: Joi.string().required(),
        jenis_kelamin: Joi.string().valid('LAKI_LAKI', 'PEREMPUAN').required()
    })
};