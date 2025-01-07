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
        .pattern(/^\+62[0-9]{8,12}$/)
        .required()
        .messages({
          'string.pattern.base': 'Kontak must start with +62 and be followed by 8 to 12 digits.',
          'any.required': 'Kontak is required'
        }),
        
        tim_kerja_id: Joi.string().uuid({ version: 'uuidv4' }).optional().messages({
            'string.guid': ' ID must be a valid UUID v4',
        }),
    }),

    edit_akun: Joi.object({
        nama_lengkap: Joi.string().optional(),
        email: Joi.string().email().optional(),
        kata_sandi: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .optional()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
            'any.required': 'Password is required'
        }),
        role: Joi.string().valid('SUPERADMIN', 'ADMIN', 'PEMINJAM').optional(),
        kontak: Joi.string().optional(),
        tim_kerja_id: Joi.string().optional(),
    }),



};