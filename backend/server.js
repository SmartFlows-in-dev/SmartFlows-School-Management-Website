const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const admissionsRoutes = require('./routes/admissionsRoutes'); // Existing admissions routes (e.g., extraction)
const submitToSheetRoutes = require('./routes/submitToSheet'); // Sheet submission proxy

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS config for Render/Prod
const allowedOrigins = [
  'https://schools.smartflows.in', // Prod frontend
  'http://localhost:5173' // Local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the origin
    } else {
      console.warn(`CORS blocked origin: ${origin}`); // Log blocked attempts
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Keep for cookies/auth if needed
  methods: ['GET', 'POST', 'OPTIONS'], // Explicit for preflights/uploads
  allowedHeaders: ['Content-Type', 'Authorization'], // For FormData/JSON
  preflightContinue: false,
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

// Apply CORS globally (handles OPTIONS preflights automatically—no need for app.options('*'))
app.use(cors(corsOptions));

// Your existing middleware
app.use(express.json({ limit: '50mb' })); // Increase for images if needed
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Your existing routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admissions', admissionsRoutes); // Existing (extraction)
app.use('/api/admissions', submitToSheetRoutes); // Submit proxy

app.get('/', (req, res) => res.send('Backend running with Firebase!'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));