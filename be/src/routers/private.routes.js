const express = require('express');
const apiRoute = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const divisiJabatanController = require('../controllers/detailUser.controller');
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


// Room Management Routes
apiRoute.post('/api/v1/ruang-rapat', authorize('SUPERADMIN'), uploadImage, ruangRapatController.createRuangRapat);
apiRoute.get('/api/v1/ruang-rapat', ruangRapatController.getAllRuangRapat);
apiRoute.get('/api/v1/ruang-rapat/:id', ruangRapatController.getRuangRapatById);
apiRoute.patch('/api/v1/ruang-rapat/:id', authorize('SUPERADMIN'), uploadImage, ruangRapatController.updateRuangRapat);
apiRoute.delete('/api/v1/ruang-rapat/:id', authorize('SUPERADMIN'), ruangRapatController.deleteRuangRapat);

// Booking Routes
router.post('/api/v1/peminjaman', authorize('PEMINJAM'), peminjamanController.createPeminjaman);
router.patch('/api/v1/peminjaman/:peminjamanId/status', authorize('ADMIN'), peminjamanController.updateStatus);
router.get('/api/v1/peminjaman', peminjamanController.getAllPeminjaman);
router.get('/api/v1/peminjaman/:peminjamanId', peminjamanController.getPeminjamanById);



module.exports = apiRoute;