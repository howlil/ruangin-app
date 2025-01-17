const Joi = require('joi');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const checkTimeRange = (value, helpers) => {
    const time = value.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);

    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60;  // 07:00
    const endMinutes = 17 * 60;   // 17:00

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
        return helpers.message('jam harus diantara 07:00 dan 17:00');
    }

    return value;
};

const validateDate = (value, helpers) => {
    // Cek format dan validitas tanggal
    if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
        return helpers.error('date.invalid');
    }

    const date = dayjs(value);
    const dayOfWeek = date.day();

    // Cek apakah hari kerja (Senin-Jumat)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return helpers.error('date.workingDay');
    }

    // Cek apakah tanggal di masa lalu
    if (date.isBefore(dayjs(), 'day')) {
        return helpers.error('date.past');
    }

    return value;
};

module.exports = {
    createPeminjaman: Joi.object({
        ruang_rapat_id: Joi.string().required(),
        nama_kegiatan: Joi.string().required(),
        tanggal: Joi.string()
            .required()
            .custom(validateDate)
            .messages({
                'string.empty': 'tanggal harus diisi',
                'date.invalid': 'format tanggal salah. gunakan YYYY-MM-DD',
                'date.workingDay': 'Tanggal Peminjaman harus dihari kerja (Senin - Jumat)',
                'date.past': 'Tanggal Peminjaman tidak boleh hari kemarin'
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
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .messages({
                'string.pattern.base': 'Format tanggal harus YYYY-MM-DD',
                'any.required': 'Tanggal harus diisi',
                'string.empty': 'Tanggal tidak boleh kosong',
            }),
        jam: Joi.string()
            .required()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .messages({
                'string.pattern.base': 'Format jam harus HH:mm (contoh: 09:00)',
                'any.required': 'Jam harus diisi',
                'string.empty': 'Jam tidak boleh kosong',
            }),
        ruang_rapat_id: Joi.string()
            .required()
            .guid({ version: 'uuidv4' })
            .messages({
                'string.guid': 'Format ID ruang rapat tidak valid',
                'any.required': 'ID ruang rapat harus diisi',
                'string.empty': 'ID ruang rapat tidak boleh kosong',
            })
    })

};