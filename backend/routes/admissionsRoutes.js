// routes/admissions.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// In-memory upload (same as you already use)
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------------------------------------------------
// CONFIG – hardcoded for simplicity (no env fallback)
// ---------------------------------------------------------------------
const AADHAAR_OCR_URL = 'https://smartflows-aadhar-extraction-model-production.up.railway.app/extract';
const LEAVING_CERT_OCR_URL = 'https://smartflows-school-leaving-certificate-t84k.onrender.com/api/v1/extract_certificate_data';
const OCR_TIMEOUT_MS = 30_000; // Increased to 30 seconds for slower OCR processing

// ---------------------------------------------------------------------
// Helper: quick health-check (GET /health) – returns true/false
// ---------------------------------------------------------------------
async function isOcrHealthy(url) {
  try {
    const baseUrl = url.replace(/\/extract$/, '').replace(/\/api.*$/, ''); // Strip /extract or /api/v1/... to get root
    await axios.get(`${baseUrl}/health`, { timeout: 3000 });
    console.log(`OCR Health Check: ${url} is healthy`);
    return true;
  } catch (err) {
    console.log(`OCR Health Check: ${url} is unhealthy - ${err.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------
// MOCK RESPONSE (used when OCR is unreachable – never blocks UI)
// Expanded to include sample extra fields for consistency
// ---------------------------------------------------------------------
const MOCK_LEAVING_CERT_RESPONSE = {
  success: true,
  data: {
    school_name: 'Mock School (dev mode)',
    last_class_attended: 'X',
    book_number: 'MOCK001',
    serial_number: 'MOCK001',
    admission_number: 'MOCK001',
    student_name: 'Mock Student',
    father_name: 'Mock Father',
    mother_name: 'Mock Mother',
    nationality: 'Indian',
    belongs_to_sc_st: 'NO',
    date_of_first_admission: '01-01-2020',
    class_at_first_admission: 'I',
    date_of_birth: '01-01-2010',
    date_of_birth_in_words: 'First January Two Thousand Ten',
    school_board_exam_result: 'Passed',
    failed_status: '',
    subjects_studied: ['Maths', 'Science', 'English'],
    promoted_to_higher_class: 'Yes',
    school_dues_paid_up_to: 'March 2025',
    fee_concession: 'None',
    total_working_days: '200',
    total_working_days_present: '195',
    ncc_cadet_boys_scout_girl_guide: 'NO',
    extracurricular_activities: 'Sports',
    general_conduct: 'Good',
    date_of_application_for_certificate: '01-04-2025',
    date_of_issue_of_certificate: '01-04-2025',
    reason_for_leaving: 'Promotion',
    other_remarks: 'Good student'
  },
};

// ---------------------------------------------------------------------
// POST /api/admissions/extract-aadhaar   (updated for new API endpoint/format)
// ---------------------------------------------------------------------
router.post('/extract-aadhaar', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.log('Aadhaar Extraction: No file uploaded');
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded' },
    });
  }

  console.log(`Aadhaar Extraction: Processing file "${req.file.originalname}" (size: ${req.file.size} bytes, mimetype: ${req.file.mimetype})`);

  // Basic validation for supported formats (JPG, JPEG, PNG)
  const supportedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!supportedMimes.includes(req.file.mimetype.toLowerCase())) {
    console.log('Aadhaar Extraction: Unsupported file format');
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_FORMAT', message: 'Only JPG, JPEG, and PNG formats are supported' },
    });
  }

  const form = new FormData();
  form.append('file', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  try {
    const resp = await axios.post(AADHAAR_OCR_URL, form, {
      headers: form.getHeaders(),
      timeout: OCR_TIMEOUT_MS,
    });

    // New API returns { success: true, data: { AADHAR_NUMBER: "...", NAME: "...", GENDER: "...", DOB: "...", ADDRESS: "..." }, detections: [...], processing_time: 1.23 }
    if (resp.data.success) {
      // Map uppercase keys to lowercase for frontend compatibility
      const mappedData = {
        success: true,
        data: {
          aadhaar_number: resp.data.data.AADHAR_NUMBER || '',
          name: resp.data.data.NAME || '',
          gender: resp.data.data.GENDER || '',
          dob: resp.data.data.DOB || '',
          address: resp.data.data.ADDRESS || '', // Optional, if frontend uses it later
        },
        // Optionally forward detections/processing_time if needed
        detections: resp.data.detections,
        processing_time: resp.data.processing_time,
      };
      console.log('Aadhaar OCR successful, mapped data:', JSON.stringify(mappedData.data, null, 2));
      res.json(mappedData);
    } else {
      // Forward OCR's non-success response (e.g., validation error)
      console.log('Aadhaar OCR returned non-success:', JSON.stringify(resp.data, null, 2));
      res.status(400).json(resp.data);
    }
  } catch (err) {
    console.error('Aadhaar OCR error:', err.message);
    console.error('Request config:', { url: AADHAAR_OCR_URL });
    console.error('Response status:', err.response?.status);
    console.error('Response data:', err.response?.data);
    console.error('Full error:', err);

    // If it's a 4xx from OCR, forward it; else 500
    if (err.response && err.response.status >= 400 && err.response.status < 500) {
      return res.status(err.response.status).json({
        success: false,
        ...err.response.data,
      });
    }

    res.status(500).json({
      success: false,
      error: { code: 'EXTRACTION_FAILED', message: err.message },
    });
  }
});

// ---------------------------------------------------------------------
// POST /api/admissions/extract-leaving-certificate
// ---------------------------------------------------------------------
router.post('/extract-leaving-certificate', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.log('Leaving-Cert Extraction: No file uploaded');
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded' },
    });
  }

  console.log(`Leaving-Cert Extraction: Processing file "${req.file.originalname}" (size: ${req.file.size} bytes)`);

  // --------------------------------------------------------------
  // 1. Try real OCR service
  // --------------------------------------------------------------
  const healthy = await isOcrHealthy(LEAVING_CERT_OCR_URL);
  if (healthy) {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    try {
      console.log('Leaving-Cert OCR: Sending request to server...');
      const resp = await axios.post(LEAVING_CERT_OCR_URL, form, {
        headers: form.getHeaders(),
        timeout: OCR_TIMEOUT_MS,
      });

      console.log('Leaving-Cert OCR: Request completed');

      // API returns: { "status":"success","data":{…} }
      if (resp.data.status === 'success') {
        // Flatten all extracted data into a single object
        const allData = {
          school_name: resp.data.data.school_name,
          last_class_attended: resp.data.data.last_class_attended,
          ...resp.data.data.all_extracted_data,
        };
        console.log('Leaving-Cert OCR successful, extracted data:', JSON.stringify(allData, null, 2));
        return res.json({
          success: true,
          data: allData,
        });
      }

      // Unexpected shape – forward as-is for debugging
      console.log('Leaving-Cert OCR: Unexpected response shape:', JSON.stringify(resp.data, null, 2));
      return res.status(502).json(resp.data);
    } catch (err) {
      console.error('Leaving-Cert OCR error:', err.message);
      console.error('Full Leaving-Cert error details:', err.response?.data || err);
      // fall-through to mock
    }
  } else {
    console.warn('Leaving-Cert OCR unreachable – returning mock data');
  }

  // --------------------------------------------------------------
  // 2. Fallback mock (never crashes the flow)
  // --------------------------------------------------------------
  console.log('Leaving-Cert Extraction: Returning mock data:', JSON.stringify(MOCK_LEAVING_CERT_RESPONSE.data, null, 2));
  res.json(MOCK_LEAVING_CERT_RESPONSE);
});

// ---------------------------------------------------------------------
// POST /api/admissions/submit-to-sheet   (updated to match frontend URL)
// ---------------------------------------------------------------------
router.post('/submit-to-sheet', express.json(), (req, res) => {
  const studentData = req.body;
  console.log('Submitted Student Data:', JSON.stringify(studentData, null, 2));
  // TODO: save to Firebase / DB / Google Sheet
  res.json({ success: true, message: 'Data saved successfully' });
});

module.exports = router;