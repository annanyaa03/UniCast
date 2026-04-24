const express = require('express');
const router = express.Router();
const { getUser, subscribe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUser);
router.post('/:id/subscribe', protect, subscribe);

module.exports = router;
