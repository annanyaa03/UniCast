const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Playlist = require('../models/Playlist');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { getPaginationParams, buildPaginationMeta } = require('../utils/paginate');

// GET /api/playlists/me - get current user's playlists
router.get('/me', protect, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const [playlists, total] = await Promise.all([
      Playlist.find({ owner: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Playlist.countDocuments({ owner: req.user._id }),
    ]);
    return sendPaginated(res, 'Playlists fetched', playlists, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
});

// POST /api/playlists
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, visibility } = req.body;
    if (!title) return sendError(res, 400, 'Title is required');
    const playlist = await Playlist.create({ title, description, visibility, owner: req.user._id });
    return sendSuccess(res, 201, 'Playlist created', playlist);
  } catch (err) { next(err); }
});

// GET /api/playlists/:id
router.get('/:id', async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'fullName username avatar')
      .populate('videos', 'title thumbnail duration views uploader')
      .lean();
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    return sendSuccess(res, 200, 'Playlist fetched', playlist);
  } catch (err) { next(err); }
});

// PUT /api/playlists/:id - add/remove video
router.put('/:id/videos', protect, async (req, res, next) => {
  try {
    const { videoId, action } = req.body;
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    if (action === 'add') {
      if (!playlist.videos.includes(videoId)) playlist.videos.push(videoId);
    } else if (action === 'remove') {
      playlist.videos.pull(videoId);
    }
    await playlist.save();
    return sendSuccess(res, 200, 'Playlist updated', playlist);
  } catch (err) { next(err); }
});

// DELETE /api/playlists/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return sendError(res, 404, 'Playlist not found');
    return sendSuccess(res, 200, 'Playlist deleted');
  } catch (err) { next(err); }
});

module.exports = router;
