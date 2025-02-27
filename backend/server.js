// server.js or app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Make uploads directory accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// 1. Register user
app.post('/api/users/register', (req, res) => {
  try {
    const { name, age, location, dob } = req.body;
    
    // Here you would typically save this to your database
    console.log('Registering user:', { name, age, location, dob });
    
    // Return success response (in a real app, return the created user or ID)
    res.status(201).json({ 
      message: 'User registered successfully',
      success: true
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Failed to register user', success: false });
  }
});

// 2. Verify user
app.post('/api/users/verify', (req, res) => {
  try {
    const { aadhaar, mobile, email, policeStation } = req.body;
    
    // Here you would verify against databases, send verification codes, etc.
    console.log('Verifying user:', { aadhaar, mobile, email, policeStation });
    
    res.status(200).json({ 
      message: 'User verification successful',
      success: true
    });
  } catch (error) {
    console.error('Error in user verification:', error);
    res.status(500).json({ message: 'Failed to verify user', success: false });
  }
});

// 3. Save user location
app.post('/api/users/location', (req, res) => {
  try {
    const { userId, location } = req.body;
    
    // Save location to database
    console.log('Saving user location:', { userId, location });
    
    res.status(200).json({ 
      message: 'Location saved successfully',
      success: true
    });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Failed to save location', success: false });
  }
});

// 4. Submit report with possible file uploads
app.post('/api/reports/submit', upload.fields([
  { name: 'imageEvidence', maxCount: 1 },
  { name: 'videoEvidence', maxCount: 1 }
]), (req, res) => {
  try {
    const reportData = req.body;
    const files = req.files;
    
    // Process files if any
    let fileDetails = {};
    if (files) {
      if (files.imageEvidence) {
        fileDetails.imageUrl = `/uploads/${files.imageEvidence[0].filename}`;
      }
      if (files.videoEvidence) {
        fileDetails.videoUrl = `/uploads/${files.videoEvidence[0].filename}`;
      }
    }
    
    // Here you would save the report to your database
    console.log('Submitting report:', { ...reportData, ...fileDetails });
    
    res.status(201).json({
      message: 'Report submitted successfully',
      success: true,
      reportId: Date.now().toString() // Mock report ID
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Failed to submit report', success: false });
  }
});

// 5. Handle emergency SOS
app.post('/api/emergency/sos', (req, res) => {
  try {
    const { userId, name, mobile, location, timestamp } = req.body;
    
    // In a real app, this would trigger emergency notifications, SMS, etc.
    console.log('EMERGENCY SOS received:', { userId, name, mobile, location, timestamp });
    
    // Simulate some processing time
    setTimeout(() => {
      res.status(200).json({ 
        message: 'Emergency services notified', 
        success: true,
        sosId: Date.now().toString() // Mock SOS ID
      });
    }, 1500);
  } catch (error) {
    console.error('Error processing SOS:', error);
    res.status(500).json({ message: 'Failed to process SOS request', success: false });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});