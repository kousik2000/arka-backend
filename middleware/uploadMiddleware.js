const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    console.log('File upload request received111:', req.body.folder , file);
    // Get folder name from request query, body, or use default
    const folder = req.body.folder || req.query.folder || 'express-uploads';
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  }
});

const upload = multer({ storage: storage });

module.exports = upload;