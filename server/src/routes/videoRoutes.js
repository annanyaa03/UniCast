const express = require('express');
const router = express.Router();
const { getVideos, getVideo, uploadVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getVideos);
router.get('/:id', getVideo);
router.post('/upload', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadVideo);

module.exports = router;
