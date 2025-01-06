const Joi = require('joi');

module.exports = {
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        kata_sandi: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
                'any.required': 'Password is required'
            })
    }),
    create_akun: Joi.object({
        nama_lengkap: Joi.string().required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('SUPERADMIN', 'ADMIN', 'PEMINJAM').required(),
        kontak: Joi.string()
            .pattern(/^[0-9]{10,14}$/)
            .required()
            .messages({
                'string.pattern.base': 'Kontak must be between 10 to 14 digits and contain only numbers.',
                'any.required': 'Kontak is required'
            }),
        jabatan_id: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
            'string.guid': 'Jabatan ID must be a valid UUID v4',
            'any.required': 'Jabatan ID is required'
        }),
        divisi_id: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
            'string.guid': 'Divisi ID must be a valid UUID v4',
            'any.required': 'Divisi ID is required'
        }),
    }),
    edit_akun: Joi.object({
        nama_lengkap: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('SUPERADMIN', 'ADMIN', 'PEMINJAM').optional(),
        kontak: Joi.string().optional(),
        jabatan_id: Joi.string().optional(),
        divisi_id: Joi.string().optional(),
    }),



};