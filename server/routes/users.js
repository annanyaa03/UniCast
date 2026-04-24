const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../config/multer');
const validate = require('../middleware/validate');
const { updateProfileSchema, changePasswordSchema } = require('../validations/userValidation');

router.get('/me', protect, userController.getMe);
router.put('/me', protect, validate(updateProfileSchema), userController.updateMe);
router.put('/me/avatar', protect, uploadImage.single('avatar'), userController.updateAvatar);
router.put('/me/banner', protect, uploadImage.single('banner'), userController.updateBanner);
router.put('/me/password', protect, validate(changePasswordSchema), userController.changePassword);
router.get('/me/history', protect, userController.getWatchHistory);
router.delete('/me/history', protect, userController.clearWatchHistory);
router.get('/me/liked', protect, userController.getLikedVideos);
router.get('/:id', optionalAuth, userController.getChannel);
router.post('/:id/subscribe', protect, userController.subscribe);
router.get('/:id/videos', optionalAuth, userController.getChannelVideos);

module.exports = router;
