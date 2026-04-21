const express = require('express');
const router = express.Router();
const { getClubs, getClub, createClub } = require('../controllers/clubController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/', protect, authorize('admin', 'professor', 'clubAdmin'), createClub);

module.exports = router;
