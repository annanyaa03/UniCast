const Notification = require('../models/Notification');
const { getSocket } = require('../sockets/socketHandler');
const logger = require('../config/logger');

const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  link,
  thumbnail,
}) => {
  try {
    if (recipient.toString() === sender?.toString()) return;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      link,
      thumbnail,
      isRead: false,
    });

    const io = getSocket();
    if (io) {
      io.to(`user:${recipient}`).emit('notification:new', {
        _id: notification._id,
        type,
        message,
        link,
        thumbnail,
        isRead: false,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (err) {
    logger.error('Failed to create notification', { error: err.message });
  }
};

module.exports = {
  notifyNewSubscriber: (channelOwnerId, subscriberId, subscriberName) =>
    createNotification({
      recipient: channelOwnerId,
      sender: subscriberId,
      type: 'subscriber',
      message: `${subscriberName} subscribed to your channel`,
      link: `/channel/${subscriberId}`,
    }),

  notifyVideoLike: (videoOwnerId, likerId, likerName, videoId, videoTitle) =>
    createNotification({
      recipient: videoOwnerId,
      sender: likerId,
      type: 'like',
      message: `${likerName} liked your video "${videoTitle}"`,
      link: `/watch/${videoId}`,
    }),

  notifyNewComment: (videoOwnerId, commenterId, commenterName, videoId, videoTitle) =>
    createNotification({
      recipient: videoOwnerId,
      sender: commenterId,
      type: 'comment',
      message: `${commenterName} commented on "${videoTitle}"`,
      link: `/watch/${videoId}`,
    }),

  notifyCommentReply: (parentCommentOwnerId, replierId, replierName, videoId) =>
    createNotification({
      recipient: parentCommentOwnerId,
      sender: replierId,
      type: 'reply',
      message: `${replierName} replied to your comment`,
      link: `/watch/${videoId}`,
    }),

  notifyVideoReady: (uploaderId, videoId, videoTitle) =>
    createNotification({
      recipient: uploaderId,
      sender: uploaderId,
      type: 'upload',
      message: `Your video "${videoTitle}" is ready to watch`,
      link: `/watch/${videoId}`,
    }),

  notifyNewClubVideo: (memberId, clubName, videoId, videoTitle) =>
    createNotification({
      recipient: memberId,
      sender: null,
      type: 'club',
      message: `${clubName} posted a new video: "${videoTitle}"`,
      link: `/watch/${videoId}`,
    }),
};
