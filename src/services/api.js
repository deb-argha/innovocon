import axios from 'axios';

// Base URL for all API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Change this to your backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User registration and profile
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// User verification
export const verifyUser = async (verificationData) => {
  try {
    const response = await api.post('/api/users/verify', verificationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Save user location
export const saveLocation = async (locationData) => {
  try {
    const response = await api.post('/api/users/location', locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Submit report with optional file uploads
export const submitReport = async (reportData) => {
  try {
    // Check if we have files to upload
    const hasFiles = reportData.imageEvidence || reportData.videoEvidence;
    
    if (hasFiles) {
      // Create FormData for multipart/form-data requests
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(reportData).forEach(key => {
        if (typeof reportData[key] !== 'object' || reportData[key] === null) {
          formData.append(key, reportData[key]);
        }
      });
      
      // Add files if present
      if (reportData.imageEvidence) {
        formData.append('imageEvidence', reportData.imageEvidence);
      }
      
      if (reportData.videoEvidence) {
        formData.append('videoEvidence', reportData.videoEvidence);
      }
      
      // Use axios directly with multipart/form-data content type
      const response = await axios.post(`${API_BASE_URL}/api/reports/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } else {
      // Regular JSON request if no files
      const response = await api.post('/api/reports/submit', reportData);
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Send emergency SOS
export const sendSOS = async (sosData) => {
  try {
    const response = await api.post('/api/emergency/sos', sosData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Fetch user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/api/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Get user's report history
export const getUserReports = async (userId) => {
  try {
    const response = await api.get(`/api/reports/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

export default api;