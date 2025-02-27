const express = require('express');
const router = express.Router();
const Petition = require('../models/Petition');

// Create a new petition
router.post('/', async (req, res) => {
  try {
    const { title, description, targetAuthority, locationId, userId } = req.body;
    
    const newPetition = new Petition({
      title,
      description,
      targetAuthority,
      locationId,
      signatures: [{ userId }] // Creator automatically signs
    });
    
    await newPetition.save();
    res.status(201).json({ success: true, petitionId: newPetition._id });
  } catch (error) {
    console.error('Error creating petition:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sign a petition
router.post('/:petitionId/sign', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const petition = await Petition.findById(req.params.petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Check if user has already signed
    const alreadySigned = petition.signatures.some(sig => sig.userId.toString() === userId);
    if (alreadySigned) {
      return res.status(400).json({ message: 'User has already signed this petition' });
    }
    
    petition.signatures.push({ userId });
    await petition.save();
    
    res.json({ success: true, signatureCount: petition.signatures.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all active petitions
router.get('/active', async (req, res) => {
  try {
    const petitions = await Petition.find({ status: 'active' });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Generate petition text (template)
router.get('/:petitionId/generate', async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.petitionId)
      .populate('locationId')
      .populate('signatures.userId');
    
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }
    
    // Generate formatted petition text
    const petitionText = `
      TO: ${petition.targetAuthority}
      
      PETITION: ${petition.title}
      
      We, the undersigned residents, hereby petition for immediate attention to the issues described below:
      
      ${petition.description}
      
      Location: ${petition.locationId ? petition.locationId.address : 'N/A'}
      
      Signatories: ${petition.signatures.length} residents
      
      Date: ${new Date().toLocaleDateString()}
    `;
    
    res.json({ petitionText });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;