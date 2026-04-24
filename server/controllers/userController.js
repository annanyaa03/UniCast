const User = require('../models/User');
const Video = require('../models/Video');
const cache = require('../utils/cache');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const logger = require('../config/logger');
const cloudinary = require('../config/cloudinary');

// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('clubs', 'name avatar slug')
      .populate('featuredVideo', 'title thumbnail views duration')
      .lean();

    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'Profile fetched', user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['fullName', 'bio', 'department', 'year', 'socialLinks'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    await cache.del(cache.keys.userProfile(req.user._id));

    logger.info('User profile updated', { userId: req.user._id });
    return sendSuccess(res, 200, 'Profile updated successfully', user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me/avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'unicast/avatars',
          transformation: [
            { width: 256, height: 256, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    await cache.del(cache.keys.userProfile(req.user._id));

    return sendSuccess(res, 200, 'Avatar updated successfully', { avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me/banner
exports.updateBanner = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No image file provided');

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'unicast/banners',
          transformation: [
            { width: 1280, height: 320, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { banner: result.secure_url },
      { new: true }
    );

    await cache.del(cache.keys.userProfile(req.user._id));

    return sendSuccess(res, 200, 'Banner updated successfully', { banner: user.banner });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me/password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validatedData || req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return sendError(res, 400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    logger.info('User changed password', { userId: req.user._id });
    return sendSuccess(res, 200, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me/history
exports.getWatchHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user._id)
      .select('watchHistory')
      .populate({
        path: 'watchHistory.video',
        select: 'title thumbnail duration views uploader createdAt',
        populate: { path: 'uploader', select: 'fullName avatar username' },
      });

    const history = user.watchHistory
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice(skip, skip + parseInt(limit));

    return sendPaginated(res, 'Watch history fetched', history, {
      page: parseInt(page),
      limit: parseInt(limit),
      total: user.watchHistory.length,
      hasNext: skip + history.length < user.watchHistory.length,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/me/history
exports.clearWatchHistory = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { watchHistory: [] } });
    return sendSuccess(res, 200, 'Watch history cleared');
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me/liked
exports.getLikedVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user._id).select('likedVideos');
    const total = user.likedVideos.length;

    const videos = await Video.find({
      _id: { $in: user.likedVideos.slice(skip, skip + parseInt(limit)) },
    })
      .populate('uploader', 'fullName avatar username')
      .lean();

    return sendPaginated(res, 'Liked videos fetched', videos, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + videos.length < total,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id - Public channel
exports.getChannel = async (req, res, next) => {
  try {
    const cacheKey = cache.keys.userProfile(req.params.id);
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const user = await User.findById(req.params.id)
      .select('-email -watchHistory -likedVideos -blockedUsers -twoFA -strikes -emailOTP -emailOTPExpiry')
      .populate('clubs', 'name avatar slug')
      .lean();

    if (!user) return sendError(res, 404, 'Channel not found');

    const videoCount = await Video.countDocuments({
      uploader: req.params.id,
      visibility: 'public',
    });

    const responseData = {
      success: true,
      message: 'Channel fetched successfully',
      data: { ...user, videoCount },
    };

    await cache.set(cacheKey, responseData, 300);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

// POST /api/users/:id/subscribe
exports.subscribe = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot subscribe to your own channel');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return sendError(res, 404, 'User not found');

    const isSubscribed = targetUser.subscribers.includes(req.user._id);

    if (isSubscribed) {
      targetUser.subscribers.pull(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { subscribedTo: req.params.id },
      });
    } else {
      targetUser.subscribers.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { subscribedTo: req.params.id },
      });
    }

    await targetUser.save();
    await cache.del(cache.keys.userProfile(req.params.id));

    return sendSuccess(res, 200, isSubscribed ? 'Unsubscribed' : 'Subscribed', {
      subscribed: !isSubscribed,
      subscriberCount: targetUser.subscribers.length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id/videos
exports.getChannelVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, sort = 'createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cacheKey = cache.keys.channelVideos(req.params.id, page);
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const filter = {
      uploader: req.params.id,
      visibility: 'public',
    };

    const sortOption = sort === 'views' ? { views: -1 } : { createdAt: -1 };

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .populate('uploader', 'fullName avatar username')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Video.countDocuments(filter),
    ]);

    const responseData = {
      success: true,
      message: 'Channel videos fetched',
      data: videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + videos.length < total,
        hasPrev: parseInt(page) > 1,
      },
    };

    await cache.set(cacheKey, responseData, 300);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};
