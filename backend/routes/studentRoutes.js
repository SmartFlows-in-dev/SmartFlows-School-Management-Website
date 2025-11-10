const express = require('express');
const admin = require('../firebaseAdmin');
const router = express.Router();

// Verify token + student role
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken.role || decodedToken.role !== 'student') {
      return res.status(403).json({ error: 'Student access required' });
    }
    req.user = { email: decodedToken.email, uid: decodedToken.uid };
    next();
  } catch (err) {
    console.error('Student token verify error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/student/dashboard (protected)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ 
    message: 'Student dashboard data', 
    user: req.user,
    stats: { 
      courses: 5,
      avgGrade: 'A-',
      attendance: '95%',
      assignments: 3
    }
  });
});

module.exports = router;