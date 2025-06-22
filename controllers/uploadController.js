const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  console.log('File upload request received:', req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract folder information from the uploaded file
    const folderPath = req.file.path.split('/').slice(0, -1).join('/');
    const folderName = folderPath.replace(/^.*\/express-uploads\//, '') || 'root';
    
    // Construct more detailed response
    const response = {
      message: 'File uploaded successfully',
      url: req.file.path,
      secure_url: req.file.path.replace('http://', 'https://'), // Force HTTPS
      public_id: req.file.filename,
      folder: folderName,
      full_folder_path: folderPath,
      format: req.file.format,
      bytes: req.file.size,
      created_at: new Date().toISOString(),
      resource_type: req.file.resource_type || 'image' // Default to image
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      message: 'Server error during upload',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    // Get folder name from query or body
    const folderName = req.query.folder || req.body.folder;

    if (!folderName) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    // Cloudinary uses the full folder path as prefix
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folderName}/`,  // Important: include trailing slash
      max_results: 100, // Optional: limit results
      resource_type: 'image' // Optional: filter only images
    });

    res.status(200).json(result.resources);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
};


exports.createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    
    // Cloudinary doesn't have a direct folder creation API
    // We create a folder by uploading a file to it
    const result = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/v1621961967/sample.jpg', {
      folder: folderName,
      public_id: '.folder-placeholder', // Special name
      overwrite: false
    });

    res.status(200).json({
      message: 'Folder created successfully',
      folder: folderName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating folder' });
  }
};

// List folders
exports.listFolders = async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();
    res.status(200).json(result.folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error listing folders' });
  }
};