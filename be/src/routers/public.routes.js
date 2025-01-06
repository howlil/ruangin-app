const route = require('express')
const router = route.Router()
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get("/",(req,res)=>{
     res.json({
        message : "API is Ready"
     });
})

router.post('/api/v1/login', authController.login);


module.exports = router