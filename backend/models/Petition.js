const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetAuthority: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  signatures: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'submitted', 'resolved'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Petition', petitionSchema);