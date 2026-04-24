const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const Comment = require('../models/Comment');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { getPaginationParams, buildPaginationMeta } = require('../utils/paginate');

// GET /api/comments?videoId=...
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { videoId } = req.query;
    if (!videoId) return sendError(res, 400, 'videoId is required');
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = { video: videoId, parentComment: null, isDeleted: false };
    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate('user', 'fullName username avatar isVerifiedBadge')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(filter),
    ]);
    return sendPaginated(res, 'Comments fetched', comments, buildPaginationMeta(page, limit, total));
  } catch (err) { next(err); }
});

// GET /api/comments/:id/replies
router.get('/:id/replies', async (req, res, next) => {
  try {
    const replies = await Comment.find({ parentComment: req.params.id, isDeleted: false })
      .populate('user', 'fullName username avatar')
      .sort({ createdAt: 1 })
      .lean();
    return sendSuccess(res, 200, 'Replies fetched', replies);
  } catch (err) { next(err); }
});

// POST /api/comments
router.post('/', protect, async (req, res, next) => {
  try {
    const { videoId, content, parentComment } = req.body;
    if (!videoId || !content) return sendError(res, 400, 'videoId and content are required');
    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      content,
      parentComment: parentComment || null,
    });
    await comment.populate('user', 'fullName username avatar');
    return sendSuccess(res, 201, 'Comment posted', comment);
  } catch (err) { next(err); }
});

// PUT /api/comments/:id
router.put('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, user: req.user._id });
    if (!comment) return sendError(res, 404, 'Comment not found');
    comment.content = req.body.content || comment.content;
    comment.isEdited = true;
    await comment.save();
    return sendSuccess(res, 200, 'Comment updated', comment);
  } catch (err) { next(err); }
});

// DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, user: req.user._id });
    if (!comment) return sendError(res, 404, 'Comment not found');
    comment.isDeleted = true;
    comment.content = '[deleted]';
    await comment.save();
    return sendSuccess(res, 200, 'Comment deleted');
  } catch (err) { next(err); }
});

// POST /api/comments/:id/like
router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return sendError(res, 404, 'Comment not found');
    const alreadyLiked = comment.likes.includes(req.user._id);
    if (alreadyLiked) comment.likes.pull(req.user._id);
    else { comment.likes.push(req.user._id); comment.dislikes.pull(req.user._id); }
    await comment.save();
    return sendSuccess(res, 200, alreadyLiked ? 'Like removed' : 'Comment liked', { likes: comment.likes.length });
  } catch (err) { next(err); }
});

module.exports = router;
