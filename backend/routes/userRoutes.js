const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, age, location, dob, aadhaar, mobile, email, photo, policeStation } = req.body;
    
    // Check if user with the same Aadhaar already exists
    const existingUser = await User.findOne({ aadhaar });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this Aadhaar already exists' });
    }
    
    const newUser = new User({
      name,
      age,
      location,
      dob,
      aadhaar,
      mobile,
      email,
      photo,
      nearestPoliceStation: policeStation
    });
    
    await newUser.save();
    res.status(201).json({ success: true, userId: newUser._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user details
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;