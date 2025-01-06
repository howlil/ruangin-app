const Joi = require('joi');

module.exports = {
    createPeminjaman: Joi.object({
        ruang_rapat_id: Joi.string().required(),
        nama_kegiatan: Joi.string().required(),
        tanggal: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .messages({
                'string.pattern.base': 'Date format must be YYYY-MM-DD'
            }),
        jam_mulai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm'
            }),
        jam_selesai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm'
            }),
        no_surat_peminjaman: Joi.string().required()
    }),

    updateStatus: Joi.object({
        status: Joi.string().valid('DIPROSES','DISETUJUI', 'DITOLAK', 'SELESAI').required()
    })
};