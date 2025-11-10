const express = require('express');
const admin = require('../firebaseAdmin');
const router = express.Router();

// Verify token + teacher role
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.role || decodedToken.role !== 'teacher') {
      return res.status(403).json({ error: 'Teacher access required' });
    }
    req.user = { email: decodedToken.email, uid: decodedToken.uid };
    next();
  } catch (err) {
    console.error('Teacher token verify error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/teacher/dashboard (protected)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ 
    message: 'Teacher dashboard data', 
    user: req.user,
    stats: { 
      classes: 6,
      students: 120,
      pendingGrades: 15,
      upcoming: 2
    }
  });
});

module.exports = router;