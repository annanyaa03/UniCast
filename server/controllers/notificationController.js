const Notification = require('../models/Notification');
const cache = require('../utils/cache');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const logger = require('../config/logger');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .populate('sender', 'fullName avatar username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    return sendPaginated(res, 'Notifications fetched', notifications, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + notifications.length < total,
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    await cache.del(cache.keys.notifications(req.user._id));
    return sendSuccess(res, 200, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    await cache.del(cache.keys.notifications(req.user._id));
    return sendSuccess(res, 200, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });
    return sendSuccess(res, 200, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};

exports.deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    await cache.del(cache.keys.notifications(req.user._id));
    return sendSuccess(res, 200, 'All notifications cleared');
  } catch (err) {
    next(err);
  }
};
