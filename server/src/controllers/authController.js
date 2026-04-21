const supabase = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.status(200).json({
    success: true,
    user: {
      ...req.user,
      ...profile
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { full_name, bio, department, year, avatar_url } = req.body;

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      full_name,
      bio,
      department,
      year,
      avatar_url,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  res.status(200).json({
    success: true,
    user: profile
  });
});

module.exports = {
  getMe,
  updateProfile
};
