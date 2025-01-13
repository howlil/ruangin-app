const route = require('express')
const router = route.Router()
const authController = require('../controllers/auth.controller');
const ruangRapatController = require('../controllers/ruangRapat.controller');
const peminjamanController = require('../controllers/peminjaman.controller');


router.get("/",(req,res)=>{
     res.json({
        message : "API is Ready"
     });
})

router.post('/api/v1/login', authController.login);
router.get('/api/v1/ruang-rapat', ruangRapatController.getAllRuangRapat);
router.get('/api/v1/ruang-rapat/:id', ruangRapatController.getRuangRapatById);
router.post('/api/v1/check', peminjamanController.checkAvailability);

module.exports = router