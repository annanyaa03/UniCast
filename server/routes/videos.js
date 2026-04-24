const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadVideoSchema, updateVideoSchema } = require('../validations/videoValidation');
const { uploadLimiter } = require('../middleware/rateLimiter');

// IMPORTANT - specific routes MUST come before /:id
router.get('/trending', videoController.getTrending);
router.get('/search', videoController.searchVideos);
router.get('/shorts', videoController.getShorts);
router.get('/', optionalAuth, videoController.getVideos);

router.post(
  '/upload',
  protect,
  uploadLimiter,
  videoController.uploadVideo
);

router.get('/:id', optionalAuth, videoController.getVideoById);
router.put('/:id', protect, validate(updateVideoSchema), videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);
router.post('/:id/like', protect, videoController.likeVideo);
router.post('/:id/dislike', protect, videoController.dislikeVideo);
router.post('/:id/view', optionalAuth, videoController.incrementView);
router.post('/:id/save', protect, videoController.saveVideo);
router.post('/:id/chapters', protect, videoController.addChapters);
router.get('/:id/related', optionalAuth, videoController.getRelatedVideos);

module.exports = router;
