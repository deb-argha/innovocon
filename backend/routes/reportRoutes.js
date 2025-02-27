const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Submit a new report
router.post('/', async (req, res) => {
  try {
    const { userId, issue, location, images, videos } = req.body;
    
    const newReport = new Report({
      userId,
      issue,
      location,
      images,
      videos
    });
    
    await newReport.save();
    res.status(201).json({ success: true, reportId: newReport._id });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reports by user
router.get('/user/:userId', async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reports by status
router.get('/status/:status', async (req, res) => {
  try {
    const reports = await Report.find({ status: req.params.status });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;