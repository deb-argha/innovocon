const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhaar: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String }, // URL to stored photo
  nearestPoliceStation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);