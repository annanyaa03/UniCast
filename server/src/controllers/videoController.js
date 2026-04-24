const Video = require('../models/Video');

// GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const {
      category,
      page = 1,
      limit = 12,
      sort = 'createdAt'
    } = req.query;

    const filter = { visibility: 'public' };

    if (category && category.trim() !== '') {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sortOption = {};
    if (sort === 'views') sortOption.views = -1;
    else if (sort === 'oldest') sortOption.createdAt = 1;
    else sortOption.createdAt = -1;

    const videos = await Video.find(filter)
      .populate('uploader', 'fullName avatar username _id')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Video.countDocuments(filter);

    return res.status(200).json({
      videos,
      hasMore: skip + videos.length < total,
      total,
      page: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/trending
exports.getTrending = async (req, res) => {
  try {
    const videos = await Video.find({ visibility: 'public' })
      .populate('uploader', 'fullName avatar username _id')
      .sort({ views: -1, createdAt: -1 })
      .limit(12)
      .lean();

    return res.status(200).json({ videos });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/search
exports.searchVideos = async (req, res) => {
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

    return res.status(200).json({
      videos,
      hasMore: skip + videos.length < total,
      total,
      page: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/videos/:id
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'fullName avatar username subscribers _id')
      .lean();

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json(video);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/videos/:id/view
exports.incrementView = async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    return res.status(200).json({ message: 'View counted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/videos/:id/like
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }

    await video.save();
    return res.status(200).json(video);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/videos/:id/dislike
exports.dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id;
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyDisliked) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();
    return res.status(200).json(video);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/videos/:id
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Video deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/videos/upload (stubbed to prevent crash since it's referenced in routes)
exports.uploadVideo = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};
