const Video = require('../models/Video');
const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');
const cache = require('../utils/cache');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const logger = require('../config/logger');

exports.search = async (req, res, next) => {
  try {
    const {
      q,
      type = 'all',
      page = 1,
      limit = 12,
      sort = 'relevance',
      category,
      duration,
      dateFilter,
    } = req.query;

    if (!q || q.trim().length === 0) {
      return sendError(res, 400, 'Search query is required');
    }

    const query = q.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const cacheKey = cache.keys.searchResults(`${query}:${type}:${sort}:${category}:${duration}`, page);

    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const results = {};

    if (type === 'all' || type === 'videos') {
      const videoFilter = {
        $text: { $search: query },
        visibility: 'public',
      };

      if (category) videoFilter.category = category;

      if (duration === 'short') videoFilter.duration = { $lt: 240 };
      else if (duration === 'medium') videoFilter.duration = { $gte: 240, $lte: 1200 };
      else if (duration === 'long') videoFilter.duration = { $gt: 1200 };

      if (dateFilter === 'today') {
        videoFilter.createdAt = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
      } else if (dateFilter === 'week') {
        videoFilter.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
      } else if (dateFilter === 'month') {
        videoFilter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
      }

      let sortOption = { score: { $meta: 'textScore' } };
      if (sort === 'views') sortOption = { views: -1 };
      else if (sort === 'date') sortOption = { createdAt: -1 };

      const [videos, videoTotal] = await Promise.all([
        Video.find(videoFilter, { score: { $meta: 'textScore' } })
          .populate('uploader', 'fullName avatar username')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Video.countDocuments(videoFilter),
      ]);

      results.videos = { items: videos, total: videoTotal };
    }

    if (type === 'all' || type === 'channels') {
      const userFilter = {
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
        ],
      };

      const users = await User.find(userFilter)
        .select('fullName username avatar subscribers department isVerifiedBadge')
        .limit(type === 'all' ? 5 : parseInt(limit))
        .lean();

      results.channels = { items: users, total: users.length };
    }

    if (type === 'all' || type === 'clubs') {
      const clubs = await Club.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(type === 'all' ? 5 : parseInt(limit))
        .lean();

      results.clubs = { items: clubs, total: clubs.length };
    }

    if (type === 'all' || type === 'events') {
      const events = await Event.find({
        $text: { $search: query },
        startDate: { $gte: new Date() },
      })
        .sort({ startDate: 1 })
        .limit(type === 'all' ? 5 : parseInt(limit))
        .lean();

      results.events = { items: events, total: events.length };
    }

    const responseData = {
      success: true,
      message: `Search results for "${query}"`,
      data: results,
      query,
    };

    await cache.set(cacheKey, responseData, 180);

    logger.info('Search performed', { query, type, userId: req.user?._id });
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return sendSuccess(res, 200, 'Suggestions', { suggestions: [] });
    }

    const query = q.trim();
    const cacheKey = `search:suggestions:${query}`;
    const cached = await cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const videos = await Video.find(
      { title: { $regex: query, $options: 'i' }, visibility: 'public' },
      { title: 1 }
    )
      .limit(8)
      .lean();

    const suggestions = [...new Set(videos.map((v) => v.title))].slice(0, 8);

    const responseData = {
      success: true,
      message: 'Suggestions fetched',
      data: { suggestions },
    };

    await cache.set(cacheKey, responseData, 60);
    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};
