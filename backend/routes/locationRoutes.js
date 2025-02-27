const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Add a new location
router.post('/', async (req, res) => {
  try {
    const { userId, type, coordinates, address, description, images } = req.body;
    
    const newLocation = new Location({
      userId,
      type,
      coordinates,
      address,
      description,
      images
    });
    
    await newLocation.save();
    res.status(201).json({ success: true, locationId: newLocation._id });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get locations by user
router.get('/user/:userId', async (req, res) => {
  try {
    const locations = await Location.find({ userId: req.params.userId });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get locations by type
router.get('/type/:type', async (req, res) => {
  try {
    const locations = await Location.find({ type: req.params.type });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all locations within a radius
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radiusInKm } = req.query;
    
    // Convert to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radius = parseFloat(radiusInKm) || 5; // Default 5km
    
    // MongoDB geospatial query would be better but for simplicity:
    const locations = await Location.find({});
    
    // Filter locations within radius (simplified distance calculation)
    const nearbyLocations = locations.filter(loc => {
      const distance = calculateDistance(
        lat, lng,
        loc.coordinates.latitude, loc.coordinates.longitude
      );
      return distance <= radius;
    });
    
    res.json(nearbyLocations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

module.exports = router;