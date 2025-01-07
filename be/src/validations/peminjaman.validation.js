const Joi = require('joi');


const checkTimeRange = (value, helpers) => {
    const time = value.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);

    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60;  // 07:00
    const endMinutes = 17 * 60;   // 17:00

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
        return helpers.message('Time must be between 07:00 and 17:00');
    }

    return value;
};

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
            .custom(checkTimeRange)
            .required()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm',
                'string.empty': 'Start time is required'
            }),
        jam_selesai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .custom(checkTimeRange)
            .custom((value, helpers) => {
                const endTime = value.split(':');
                const startTime = helpers.state.ancestors[0].jam_mulai?.split(':');

                if (!startTime) return value;

                const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
                const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);

                if (endMinutes <= startMinutes) {
                    return helpers.message('End time must be after start time');
                }

                return value;
            })
            .required()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm',
                'string.empty': 'End time is required'
            }),
        no_surat_peminjaman: Joi.string().required()
    }),

    updateStatus : Joi.object({
        ruang_rapat_id: Joi.string().optional(),
        nama_kegiatan: Joi.string().optional(),
        tanggal: Joi.string().optional(),
        jam_mulai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .optional()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm'
            }),
        jam_selesai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .optional()
            .messages({
                'string.pattern.base': 'Time format must be HH:mm'
            }),
        status: Joi.string().valid('DISETUJUI', 'DITOLAK').optional(),
        alasan_penolakan: Joi.when('status', {
            is: 'DITOLAK',
            then: Joi.string().required().messages({
                'any.required': 'Alasan penolakan harus diisi ketika status DITOLAK'
            }),
            otherwise: Joi.string().optional()
        })
    })
};