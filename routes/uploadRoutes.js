const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

// Upload image
router.post('/upload', upload.single('image'), uploadController.uploadImage);

// Delete image
router.delete('/delete/:public_id', uploadController.deleteImage);

// Get all images
router.get('/images', uploadController.getAllImages);

module.exports = router;