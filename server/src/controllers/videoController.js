const supabase = require('../config/supabase');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = asyncHandler(async (req, res) => {
  const { category, q, creatorId, page = 1, limit = 10 } = req.query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('videos')
    .select('*, profiles(full_name, username, avatar_url)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category.toLowerCase());
  if (creatorId) query = query.eq('creator_id', creatorId);
  if (q) query = query.ilike('title', `%${q}%`);

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  res.status(200).json({
    success: true,
    videos: data,
    page: parseInt(page),
    hasMore: count > (from + limit)
  });
});

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
const getVideo = asyncHandler(async (req, res) => {
  const { data: video, error } = await supabase
    .from('videos')
    .select('*, profiles(full_name, username, avatar_url)')
    .eq('id', req.params.id)
    .single();

  if (error || !video) {
    res.status(404);
    throw new Error('Video not found');
  }

  // Increment views (naive)
  await supabase
    .from('videos')
    .update({ views_count: video.views_count + 1 })
    .eq('id', req.params.id);

  res.status(200).json({
    success: true,
    video
  });
});

// @desc    Upload video
// @route   POST /api/videos/upload
// @access  Private
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category, visibility, tags } = req.body;
  
  if (!req.files || !req.files.video) {
    res.status(400);
    throw new Error('Please upload a video');
  }

  const videoFile = req.files.video[0];
  const thumbFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

  try {
    // Upload to Cloudinary
    const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: 'video',
      folder: 'unicast/videos'
    });

    let thumbUrl = '';
    if (thumbFile) {
      const thumbUpload = await cloudinary.uploader.upload(thumbFile.path, {
        folder: 'unicast/thumbnails'
      });
      thumbUrl = thumbUpload.secure_url;
    } else {
      // Auto-generate thumbnail from video
      thumbUrl = videoUpload.secure_url.replace(/\.[^/.]+$/, ".jpg");
    }

    // Save to Supabase
    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        creator_id: req.user.id,
        title,
        description,
        url: videoUpload.secure_url,
        thumbnail_url: thumbUrl,
        duration: Math.floor(videoUpload.duration),
        category: category.toLowerCase(),
        visibility,
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      })
      .select()
      .single();

    if (error) throw error;

    // Clean up local files
    fs.unlinkSync(videoFile.path);
    if (thumbFile) fs.unlinkSync(thumbFile.path);

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    // Clean up local files on error
    if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
    if (thumbFile && fs.existsSync(thumbFile.path)) fs.unlinkSync(thumbFile.path);
    throw error;
  }
});

module.exports = {
  getVideos,
  getVideo,
  uploadVideo
};
