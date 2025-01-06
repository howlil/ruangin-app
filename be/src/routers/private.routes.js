
const express = require('express');
const apiRoute = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');


apiRoute.use(authenticate)
apiRoute.post('/api/v1/register', authenticate, authorize('SUPERADMIN'), authController.register);
apiRoute.patch('/api/v1/users/:userId', authenticate, authorize('SUPERADMIN'), authController.updateUser);
apiRoute.patch('api/v2/users/', authenticate, authorize('SUPERADMIN'), authController.updateUser);
apiRoute.delete('/users/:userId', authenticate, authorize('SUPERADMIN'), authController.deleteUser);
apiRoute.post('/logout', authenticate, authController.logout);
apiRoute.get('/me', authenticate, authController.getCurrentUser);