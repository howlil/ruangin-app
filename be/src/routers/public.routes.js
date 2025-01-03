const route = require('express')
const router = route.Router()

router.get("/",(req,res)=>{
     res.json({
        message : "API is Ready"
     });
})

module.exports = router