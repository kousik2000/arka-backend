const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ message: 'No public_id provided' });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'express-uploads/'
    });

    res.status(200).json(result.resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
};