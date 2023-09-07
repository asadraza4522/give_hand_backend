const multer = require('multer');
const path = require('path');
const cloudinary = require('../utilities/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});


const upload = multer({ storage: storage });

module.exports = upload;