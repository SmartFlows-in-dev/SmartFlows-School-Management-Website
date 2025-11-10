const express = require('express');
const fetch = require('node-fetch'); // For Node <18; if on Node 18+, replace with native fetch
const router = express.Router();

// Your Google Apps Script web app URL (keep this as-is)
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyGU2GlIjWA6ult4XbNdtk1wQs42mf1iiK3DBcxBMfpcGLYJpJhPOOWc7Nil3iihFaN/exec';

router.post('/submit-to-sheet', async (req, res) => {
  try {
    // Log incoming data for debugging (remove in production if not needed)
    console.log('Received admission submission:', req.body);

    // Forward POST to GAS
    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Send formData as-is
    });

    if (!gasResponse.ok) {
      throw new Error(`GAS returned ${gasResponse.status}: ${gasResponse.statusText}`);
    }

    const gasData = await gasResponse.json();
    console.log('GAS success response:', gasData); // Optional logging

    // Return GAS response to frontend
    res.json(gasData);
  } catch (error) {
    console.error('Error submitting to sheet:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save to sheet and send email',
    });
  }
});

module.exports = router;