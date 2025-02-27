const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const path = require('path');

// Endpoint to handle file uploads
router.post('/', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      fileUrl 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;