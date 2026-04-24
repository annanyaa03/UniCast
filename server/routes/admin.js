const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.put('/users/:id/role', adminController.changeUserRole);
router.get('/videos', adminController.getVideos);
router.delete('/videos/:id', adminController.deleteVideo);
router.put('/videos/:id/feature', adminController.featureVideo);
router.get('/reports', adminController.getReports);
router.put('/reports/:id/dismiss', adminController.dismissReport);
router.post('/broadcast', adminController.broadcastEmail);

module.exports = router;
