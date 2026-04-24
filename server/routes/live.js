const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/live - placeholder for live stream endpoints
router.get('/', protect, async (req, res) => {
  return sendSuccess(res, 200, 'Live streams coming soon', { streams: [] });
});

// POST /api/live/start
router.post('/start', protect, async (req, res) => {
  return sendSuccess(res, 200, 'Live streaming feature coming soon');
});

// POST /api/live/end
router.post('/end', protect, async (req, res) => {
  return sendSuccess(res, 200, 'Live streaming feature coming soon');
});

module.exports = router;
