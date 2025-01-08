const express = require('express');
const apiRoute = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const detailUserController = require('../controllers/detailUser.controller');
const { uploadImage } = require('../middlewares/image.middleware');
const ruangRapatController = require('../controllers/ruangRapat.controller');
const peminjamanController = require('../controllers/peminjaman.controller');

apiRoute.use(authenticate);

// Auth & User Management Routes - v1
apiRoute.post('/api/v1/register', authorize('SUPERADMIN'), authController.register);
apiRoute.patch('/api/v1/users/:userId', authorize('SUPERADMIN'), authController.updateUser);
apiRoute.delete('/api/v1/users/:userId', authorize('SUPERADMIN'), authController.deleteUser);
apiRoute.post('/api/v1/logout', authController.logout);
apiRoute.get('/api/v1/me', authController.getCurrentUser);
apiRoute.get('/api/v1/pengguna', authController.getAllUser);

// Auth & User Management Routes - v2
apiRoute.patch('/api/v2/users', authorize('PEMINJAM'), authController.updateUser);


// TimKerja Routes
apiRoute.post('/api/v1/tim-kerja', authorize('SUPERADMIN'), detailUserController.createTimKerja);
apiRoute.get('/api/v1/tim-kerja', detailUserController.getAllTimKerja);
apiRoute.get('/api/v1/tim-kerja/:id', detailUserController.getTimKerjaById);
apiRoute.patch('/api/v1/tim-kerja/:id', authorize('SUPERADMIN'), detailUserController.updateTimKerja);
apiRoute.delete('/api/v1/tim-kerja/:id', authorize('SUPERADMIN'), detailUserController.deleteTimKerja);

// Room Management Routes
apiRoute.post('/api/v1/ruang-rapat', authorize('SUPERADMIN'), uploadImage, ruangRapatController.createRuangRapat);
apiRoute.get('/api/v1/ruang-rapat', ruangRapatController.getAllRuangRapat);
apiRoute.get('/api/v1/ruang-rapat/:id', ruangRapatController.getRuangRapatById);
apiRoute.patch('/api/v1/ruang-rapat/:id', authorize('SUPERADMIN'), uploadImage, ruangRapatController.updateRuangRapat);
apiRoute.delete('/api/v1/ruang-rapat/:id', authorize('SUPERADMIN'), ruangRapatController.deleteRuangRapat);

// Booking Routes
apiRoute.post('/api/v1/peminjaman', authorize(['PEMINJAM',"ADMIN"]), peminjamanController.createPeminjaman);
apiRoute.patch('/api/v1/peminjaman/:peminjamanId/status', authorize('ADMIN'), peminjamanController.updateStatus);
apiRoute.get('/api/v1/peminjaman', peminjamanController.getAllPeminjaman);
apiRoute.get('/api/v2/peminjaman', peminjamanController.getPeminjaman);
apiRoute.get('/api/v1/peminjaman/:peminjamanId', peminjamanController.getPeminjamanById);

apiRoute.get('/api/v1/statistik', peminjamanController.getRuanganStatistics);



module.exports = apiRoute;