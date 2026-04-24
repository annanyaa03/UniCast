const Video = require('../models/Video');
const cache = require('../utils/cache');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const videoQueue = require('../queues/videoQueue');
const logger = require('../config/logger');

exports.getVideos = async (req, res, next) => {
  try {
    const { category = '', page = 1, limit = 12, sort = 'createdAt' } = req.query;
    const cacheKey = cache.keys.videoFeed(page, category);

    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const filter = { visibility: 'public' };
    if (category && category.trim() !== '') filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOption = sort === 'views' ? { views: -1 } : { createdAt: -1 };

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .populate('uploader', 'fullName avatar username _id')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Video.countDocuments(filter),
    ]);

    const responseData = {
      success: true,
      message: 'Videos fetched successfully',
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

exports.getTrending = async (req, res, next) => {
  try {
    const cacheKey = cache.keys.trending();
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const videos = await Video.find({ visibility: 'public' })
      .populate('uploader', 'fullName avatar username _id')
      .sort({ views: -1, createdAt: -1 })
      .limit(20)
      .lean();

    const responseData = {
      success: true,
      message: 'Trending videos fetched',
      data: videos,
    };

    await cache.set(cacheKey, responseData, 600);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

exports.searchVideos = async (req, res, next) => {
  try {
    const { q = '', page = 1, limit = 12 } = req.query;
    const filter = { visibility: 'public', title: { $regex: q, $options: 'i' } };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find(filter)
      .populate('uploader', 'fullName avatar username _id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Video.countDocuments(filter);

    return sendPaginated(res, 'Videos found', videos, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      hasNext: skip + videos.length < total
    });
  } catch (err) {
    next(err);
  }
};

exports.getVideoById = async (req, res, next) => {
  try {
    const cacheKey = cache.keys.videoDetail(req.params.id);
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const video = await Video.findById(req.params.id)
      .populate('uploader', 'fullName avatar username subscribers _id isVerifiedBadge')
      .lean();

    if (!video) {
      return sendError(res, 404, 'Video not found');
    }

    if (video.visibility === 'private') {
      if (!req.user || req.user._id.toString() !== video.uploader._id.toString()) {
        return sendError(res, 403, 'This video is private');
      }
    }

    const responseData = {
      success: true,
      message: 'Video fetched successfully',
      data: video,
    };

    await cache.set(cacheKey, responseData, 120);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    await cache.del(cache.keys.videoDetail(req.params.id));
    await cache.del(cache.keys.trending());
    return sendSuccess(res, 200, 'View counted');
  } catch (err) {
    next(err);
  }
};

exports.likeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    const userId = req.user._id;
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }

    await video.save();

    // Invalidate cache
    await cache.del(cache.keys.videoDetail(req.params.id));

    return sendSuccess(res, 200, alreadyLiked ? 'Like removed' : 'Video liked', { 
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      isLiked: !alreadyLiked,
    });
  } catch (err) {
    next(err);
  }
};

exports.dislikeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    const userId = req.user._id;
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyDisliked) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();
    
    // Invalidate cache
    await cache.del(cache.keys.videoDetail(req.params.id));
    
    return sendSuccess(res, 200, alreadyDisliked ? 'Dislike removed' : 'Video disliked', {
      likes: video.likes.length,
      dislikes: video.dislikes.length,
      isDisliked: !alreadyDisliked,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return sendError(res, 404, 'Video not found');

    if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized');
    }

    await Video.findByIdAndDelete(req.params.id);
    
    // Invalidate cache
    await cache.del(cache.keys.videoDetail(req.params.id));
    await cache.delPattern('videos:feed:*');
    await cache.del(cache.keys.trending());
    
    return sendSuccess(res, 200, 'Video deleted');
  } catch (err) {
    next(err);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'No video file provided');

    const { title, description, category, visibility, tags, isShort } = req.validatedData || req.body;

    const video = await Video.create({
      title,
      description,
      category: category || 'general',
      visibility: visibility || 'public',
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      isShort: isShort || false,
      uploader: req.user._id,
      videoUrl: '',
      thumbnail: '',
      processingStatus: 'queued',
    });

    await videoQueue.add('process-video', {
      videoId: video._id.toString(),
      filePath: req.file.path,
      uploaderId: req.user._id.toString(),
    });

    logger.info('Video upload queued', { videoId: video._id, userId: req.user._id });

    return sendSuccess(res, 201, 'Video upload started. It will be ready shortly.', {
      videoId: video._id,
      processingStatus: 'queued',
    });
  } catch (err) {
    next(err);
  }
};
