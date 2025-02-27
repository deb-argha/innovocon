const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['home', 'water', 'toilet', 'other'], required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  address: { type: String },
  description: { type: String },
  images: [{ type: String }], // URLs to stored images
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema);