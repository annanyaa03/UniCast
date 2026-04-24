const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, optionalAuth } = require('../middleware/auth');

// CORRECT ORDER - specific routes first, param routes last
router.get('/trending', videoController.getTrending);          // FIRST
router.get('/search', videoController.searchVideos);           // SECOND
router.get('/', optionalAuth, videoController.getVideos);      // THIRD
router.get('/:id', optionalAuth, videoController.getVideoById); // LAST

router.post('/upload', protect, videoController.uploadVideo);
router.post('/:id/like', protect, videoController.likeVideo);
router.post('/:id/dislike', protect, videoController.dislikeVideo);
router.post('/:id/view', videoController.incrementView);
router.delete('/:id', protect, videoController.deleteVideo);

module.exports = router;
