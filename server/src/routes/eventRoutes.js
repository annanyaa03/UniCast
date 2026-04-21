const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin', 'professor', 'clubAdmin'), createEvent);

module.exports = router;
