const express = require('express');
const admin = require('../firebaseAdmin');
const router = express.Router();

// Verify token + admin role (fallback for manual user)
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    let role = decodedToken.role;
    // FALLBACK: For manual console user (email 'admin@gmail.com')
    if (!role && decodedToken.email === 'admin@gmail.com') {
      role = 'admin';
      console.log('Fallback role: admin for manual user');
    }
    if (!role || role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = { email: decodedToken.email, uid: decodedToken.uid };
    next();
  } catch (err) {
    console.error('Token verify error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/admin/dashboard (protected)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ 
    message: 'Admin dashboard data', 
    user: req.user,
    stats: { 
      totalStudents: 1250,
      activeTeachers: 45,
      pendingAdmissions: 23,
      alerts: 2
    }
  });
});

// POST /api/admin/create-user (protected, supports student/teacher/admin)
router.post('/create-user', verifyToken, async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid input: email, password, and role (student/teacher/admin) required' });
  }
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`
    });
    console.log('User created UID:', userRecord.uid, 'for', email, 'role:', role);
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    console.log('Claims set success for UID:', userRecord.uid);
    res.json({ success: true, uid: userRecord.uid, message: 'User created successfully' });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(400).json({ error: err.message });
  }
});

// TEMP: POST /api/admin/set-admin-role (for manual user, DELETE after use)
router.post('/set-admin-role', async (req, res) => {
  const { uid, email } = req.body;
  const secret = req.headers['x-secret'];
  if (secret !== process.env.SECURITY_CODE) return res.status(403).json({ error: 'Wrong secret' });
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log('Manual admin role set for UID:', uid);
    res.json({ success: true, message: `Admin role set for ${email}` });
  } catch (err) {
    console.error('Set role error:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;