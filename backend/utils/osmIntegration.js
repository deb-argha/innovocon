// utils/osmIntegration.js
const axios = require('axios');

// Function to reverse geocode coordinates to get address
async function reverseGeocode(lat, lon) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        lat: lat,
        lon: lon
      },
      headers: {
        'User-Agent': 'SlumMappingApp/1.0'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
}

// Function to search for places nearby
async function searchNearby(lat, lon, amenity, radius = 1000) {
  try {
    // Use Overpass API for more complex queries
    const query = `
      [out:json];
      node(around:${radius},${lat},${lon})["amenity"="${amenity}"];
      out body;
    `;
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in searching nearby amenities:', error);
    throw error;
  }
}

// Function to add a node to OpenStreetMap (note: requires authentication)
// For a hackathon, you might want to just simulate this or use a test instance
async function addNode(lat, lon, tags, credentials) {
  // This is a simplified example - in reality, OSM edits require more steps
  // For a hackathon, consider just storing this data in your own DB
  
  console.log('Would add node to OSM:', { lat, lon, tags });
  return {
    success: true,
    message: 'Node simulated (not actually added to OSM)'
  };
}

module.exports = {
  reverseGeocode,
  searchNearby,
  addNode
};