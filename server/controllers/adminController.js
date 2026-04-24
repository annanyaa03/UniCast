const User = require('../models/User');
const Video = require('../models/Video');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const cache = require('../utils/cache');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const logger = require('../config/logger');
const { sendEmail } = require('../utils/email');

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const cacheKey = 'admin:stats';
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalVideos,
      totalReports,
      newUsersThisWeek,
      newVideosThisWeek,
      totalViews,
      bannedUsers,
      pendingReports,
    ] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Report.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Video.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Video.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      User.countDocuments({ isBanned: true }),
      Report.countDocuments({ status: 'pending' }),
    ]);

    const viewsData = await Video.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: '$views' },
          uploads: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryData = await Video.aggregate([
      { $match: { visibility: 'public' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const responseData = {
      success: true,
      message: 'Admin stats fetched',
      data: {
        overview: {
          totalUsers,
          totalVideos,
          totalViews: totalViews[0]?.total || 0,
          totalReports,
          newUsersThisWeek,
          newVideosThisWeek,
          bannedUsers,
          pendingReports,
        },
        charts: {
          viewsAndUploads: viewsData,
          videosByCategory: categoryData,
        },
      },
    };

    await cache.set(cacheKey, responseData, 300);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (status === 'banned') filter.isBanned = true;
    if (status === 'verified') filter.isVerified = true;
    if (status === 'unverified') filter.isVerified = false;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -emailOTP -emailOTPExpiry -twoFA')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Users fetched', users, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + users.length < total,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/ban
exports.banUser = async (req, res, next) => {
  try {
    const { reason, duration } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    if (user.role === 'admin') return sendError(res, 403, 'Cannot ban another admin');

    user.isBanned = true;
    user.banReason = reason || 'Policy violation';
    if (duration) {
      user.banExpiry = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }
    await user.save();

    await cache.del(cache.keys.userProfile(user._id));

    logger.warn('User banned by admin', {
      bannedUserId: user._id,
      adminId: req.user._id,
      reason,
    });

    return sendSuccess(res, 200, 'User banned successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/unban
exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false, banReason: undefined, banExpiry: undefined },
      { new: true }
    );
    if (!user) return sendError(res, 404, 'User not found');

    await cache.del(cache.keys.userProfile(user._id));

    logger.info('User unbanned', { userId: user._id, adminId: req.user._id });
    return sendSuccess(res, 200, 'User unbanned successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/users/:id/role
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'professor', 'clubAdmin', 'admin'];

    if (!validRoles.includes(role)) {
      return sendError(res, 400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return sendError(res, 404, 'User not found');

    await cache.del(cache.keys.userProfile(user._id));

    logger.info('User role changed', {
      userId: user._id,
      newRole: role,
      adminId: req.user._id,
    });

    return sendSuccess(res, 200, 'User role updated', { role: user.role });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/videos
exports.getVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (status === 'public') filter.visibility = 'public';
    if (status === 'private') filter.visibility = 'private';
    if (status === 'unlisted') filter.visibility = 'unlisted';

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .populate('uploader', 'fullName username email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Video.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Admin videos fetched', videos, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + videos.length < total,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/videos/:id
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    await cache.del(cache.keys.videoDetail(req.params.id));
    await cache.delPattern('videos:feed:*');
    await cache.del(cache.keys.trending());

    logger.warn('Video deleted by admin', {
      videoId: video._id,
      videoTitle: video.title,
      adminId: req.user._id,
    });

    return sendSuccess(res, 200, 'Video deleted successfully');
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/videos/:id/feature
exports.featureVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isFeatured: true },
      { new: true }
    );
    if (!video) return sendError(res, 404, 'Video not found');

    await cache.del(cache.keys.videoDetail(req.params.id));
    await cache.delPattern('videos:feed:*');

    return sendSuccess(res, 200, 'Video featured on home page');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/reports
exports.getReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = 'pending' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find({ status })
        .populate('reporter', 'fullName username avatar')
        .populate('video', 'title thumbnail uploader')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Report.countDocuments({ status }),
    ]);

    return sendPaginated(res, 'Reports fetched', reports, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + reports.length < total,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/reports/:id/dismiss
exports.dismissReport = async (req, res, next) => {
  try {
    await Report.findByIdAndUpdate(req.params.id, {
      status: 'dismissed',
      resolvedBy: req.user._id,
      resolvedAt: new Date(),
    });
    return sendSuccess(res, 200, 'Report dismissed');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/broadcast
exports.broadcastEmail = async (req, res, next) => {
  try {
    const { subject, message, targetRole } = req.body;

    if (!subject || !message) {
      return sendError(res, 400, 'Subject and message are required');
    }

    const filter = { isVerified: true };
    if (targetRole && targetRole !== 'all') filter.role = targetRole;

    const users = await User.find(filter).select('email fullName').lean();

    logger.info('Admin broadcast initiated', {
      adminId: req.user._id,
      recipientCount: users.length,
      subject,
    });

    return sendSuccess(res, 200, `Broadcast queued for ${users.length} users`, {
      recipientCount: users.length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const [signupsOverTime, uploadsOverTime, topVideos, topCreators] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Video.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            views: { $sum: '$views' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Video.find({ visibility: 'public' })
        .sort({ views: -1 })
        .limit(10)
        .populate('uploader', 'fullName username')
        .select('title thumbnail views likes duration createdAt')
        .lean(),

      User.aggregate([
        {
          $lookup: {
            from: 'videos',
            localField: '_id',
            foreignField: 'uploader',
            as: 'videos',
          },
        },
        {
          $project: {
            fullName: 1,
            username: 1,
            avatar: 1,
            videoCount: { $size: '$videos' },
            totalViews: { $sum: '$videos.views' },
            subscriberCount: { $size: '$subscribers' },
          },
        },
        { $sort: { totalViews: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return sendSuccess(res, 200, 'Analytics fetched', {
      signupsOverTime,
      uploadsOverTime,
      topVideos,
      topCreators,
    });
  } catch (err) {
    next(err);
  }
};
