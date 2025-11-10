const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');

// Optional: POST /api/auth/refresh-token (for token expiry)
router.post('/refresh-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const refreshedToken = await admin.auth().createCustomToken(decodedToken.uid);
    res.json({ token: refreshedToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;