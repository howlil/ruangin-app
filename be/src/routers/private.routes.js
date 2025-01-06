const express = require('express');
const apiRoute = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const divisiJabatanController = require('../controllers/detailUser.controller');

// Apply authentication middleware to all routes
apiRoute.use(authenticate);

// Auth & User Management Routes - v1
apiRoute.post('/api/v1/register', authorize('SUPERADMIN'), authController.register);
apiRoute.patch('/api/v1/users/:userId', authorize('SUPERADMIN'), authController.updateUser);
apiRoute.delete('/api/v1/users/:userId', authorize('SUPERADMIN'), authController.deleteUser);
apiRoute.post('/api/v1/logout', authController.logout);
apiRoute.get('/api/v1/me', authController.getCurrentUser);

// Auth & User Management Routes - v2
apiRoute.patch('/api/v2/users', authorize('SUPERADMIN'), authController.updateUser);

// Divisi Routes
apiRoute.post('/api/v1/divisi', authorize('SUPERADMIN'), divisiJabatanController.createDivisi);
apiRoute.get('/api/v1/divisi', divisiJabatanController.getAllDivisi);
apiRoute.get('/api/v1/divisi/:id', divisiJabatanController.getDivisiById);
apiRoute.put('/api/v1/divisi/:id', authorize('SUPERADMIN'), divisiJabatanController.updateDivisi);
apiRoute.delete('/api/v1/divisi/:id', authorize('SUPERADMIN'), divisiJabatanController.deleteDivisi);

// Jabatan Routes
apiRoute.post('/api/v1/jabatan', authorize('SUPERADMIN'), divisiJabatanController.createJabatan);
apiRoute.get('/api/v1/jabatan', divisiJabatanController.getAllJabatan);
apiRoute.get('/api/v1/jabatan/:id', divisiJabatanController.getJabatanById);
apiRoute.put('/api/v1/jabatan/:id', authorize('SUPERADMIN'), divisiJabatanController.updateJabatan);
apiRoute.delete('/api/v1/jabatan/:id', authorize('SUPERADMIN'), divisiJabatanController.deleteJabatan);

module.exports = apiRoute;