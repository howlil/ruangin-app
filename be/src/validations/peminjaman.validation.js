const Joi = require('joi');
const { checkTimeRange, validateDate } = require("../utils/dayjs")
const moment = require('moment')


module.exports = {
    createPeminjaman: Joi.object({
        ruang_rapat_id: Joi.string().required(),
        nama_kegiatan: Joi.string().required(),
        tanggal_mulai: Joi.string()
            .required()
            .custom(validateDate)
            .messages({
                'string.empty': 'tanggal mulai harus diisi',
                'date.invalid': 'format tanggal salah. gunakan YYYY-MM-DD',
                'date.workingDay': 'Tanggal Peminjaman harus dihari kerja (Senin - Jumat)',
                'date.past': 'Tanggal Peminjaman tidak boleh hari kemarin'
            }),
        tanggal_selesai: Joi.string()
            .custom(validateDate)
            .allow(null)
            .custom((value, helpers) => {
                if (!value) return value;

                const startDate = moment(helpers.state.ancestors[0].tanggal_mulai);
                const endDate = moment(value);

                if (endDate.isBefore(startDate)) {
                    return helpers.message('tanggal selesai harus setelah tanggal mulai');
                }

                return value;
            })
            .messages({
                'date.invalid': 'format tanggal salah. gunakan YYYY-MM-DD',
                'date.workingDay': 'Tanggal Peminjaman harus dihari kerja (Senin - Jumat)'
            }),
        jam_mulai: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .custom(checkTimeRange)
            .required()
            .messages({
                'string.pattern.base': 'Format waktu harus seperti "08:00"',
                'string.empty': 'jam mulai harus diisi'
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
                    return helpers.message('jam selesai harus setelah jam mulai');
                }

                return value;
            })
            .required()
            .messages({
                'string.pattern.base': 'Format waktu harus seperti "08:00"',
                'string.empty': 'jam selesai harus diisi'
            }),
        no_surat_peminjaman: Joi.string().required()
    }),

    updateStatus: Joi.object({
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
    }),
    checkAvailability: Joi.object({
        tanggal: Joi.string()
            .required()
            .custom(validateDate)
            .messages({
                'string.empty': 'tanggal harus diisi',
                'date.invalid': 'format tanggal salah. gunakan YYYY-MM-DD',
                'date.workingDay': 'Tanggal Peminjaman harus dihari kerja (Senin - Jumat)',
                'date.past': 'Tanggal Peminjaman tidak boleh hari kemarin'
            }),
        jam: Joi.string()
            .required()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .messages({
                'string.pattern.base': 'Format jam harus HH:mm (contoh: 09:00)',
                'any.required': 'Jam harus diisi',
                'string.empty': 'Jam tidak boleh kosong',
            })
    })


};