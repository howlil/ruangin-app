const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.info('Created directory for images: public/images');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.info(`Preparing to upload file to: ${uploadDir}`);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + ext;
        console.info(`Saving file as: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        console.warn(`Invalid file type: ${file.mimetype}`);
        return cb(new Error('Only images are allowed!'), false);
    }
    console.info(`File accepted: ${file.originalname}`);
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  
});

const uploadImage = upload.single('foto_ruangan');

module.exports = {
    uploadImage
};