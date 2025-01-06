const Joi = require("joi")

module.exports ={
    create_division : {
        nama_divisi : Joi.string().required()
    },
    create_jabatan : {
        nama_jabatan : Joi.string().required()
    },
}