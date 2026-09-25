const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// Require a valid API key for all resume routes to prevent unauthorized use
// of the OpenAI-backed endpoints (CWE-862: Missing Authorization).
function requireApiKey(req, res, next) {
  const expectedKey = process.env.API_KEY;
  if (!expectedKey) {
    console.error('API_KEY is not configured on the server');
    return res.status(500).json({ success: false, message: 'Server misconfiguration' });
  }
  const providedKey = req.header('x-api-key');
  if (providedKey !== expectedKey) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  return next();
}

router.use(requireApiKey);

// POST /api/generate
router.post('/generate', resumeController.generateResume);

// GET /api/history
router.get('/history', resumeController.getHistory);

module.exports = router;
