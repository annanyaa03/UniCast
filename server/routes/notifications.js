const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, notificationController.getNotifications);
router.put('/read-all', protect, notificationController.markAllRead);
router.put('/:id/read', protect, notificationController.markAsRead);
router.delete('/all', protect, notificationController.deleteAllNotifications);
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
