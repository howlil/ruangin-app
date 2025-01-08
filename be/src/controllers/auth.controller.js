// controllers/authController.js
const { validate } = require('../utils/validation');
const authService = require('../services/auth.service.js');
const authValidation = require('../validations/auth.validation');
const { ResponseError } = require('../utils/responseError');

const authController = {
    async login(req, res, next) {
        try {
            const validated = validate(authValidation.login, req.body);
            console.log(validated)
            const result = await authService.login(validated.email, validated.kata_sandi);

            res.status(200).json({
                status: true,
                message: "Login successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async register(req, res, next) {
        try {
            const userData = validate(authValidation.create_akun, req.body);
            const result = await authService.register(userData);

            res.status(201).json({
                status: true,
                message: "User registered successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateUser(req, res, next) {
        try {

            let userId;

            if (req.params.userId) {
                userId = req.params.userId
            } else {
                userId = req.user.id;
            }

            const userData = validate(authValidation.edit_akun, req.body);
            const result = await authService.updateUser(userId, userData);

            res.status(200).json({
                status: true,
                message: "User updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const result = await authService.deleteUser(userId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new ResponseError(401, "No token provided");
            }

            await authService.logout(token);

            res.status(200).json({
                status: true,
                message: "Logout successful"
            });
        } catch (error) {
            next(error);
        }
    },

    async getCurrentUser(req, res, next) {
        try {
            const user = req.user;

            res.status(200).json({
                status: true,
                message: "Current user data retrieved successfully",
                data: {
                    id: user.id,
                    nama_lengkap: user.nama_lengkap,
                    email: user.email,
                    role: user.role,
                    detail_pengguna: user.DetailPengguna
                }
            });
        } catch (error) {
            next(error);
        }
    },
    async getAllUser(req, res, next) {
        try {
            const { page, size } = req.query;
            const result = await authService.getAllUser({
                page,
                size
            });            
            if (result.status === 404) {
                return res.status(404).json({
                    status: false,
                    message: result.message
                });
            }
    
            res.status(200).json({
                status: true,
                message: "Users data retrieved successfully",
                data: result.data,
                pagination: result.pagination  
            });
        } catch (error) {
            next(error);
        }
    }

};

module.exports = authController;