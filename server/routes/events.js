const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent } = require('../controllers/eventController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, restrictTo('admin', 'professor', 'clubAdmin'), createEvent);

module.exports = router;
