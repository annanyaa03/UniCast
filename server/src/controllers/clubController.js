const supabase = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = asyncHandler(async (req, res) => {
  const { category, q } = req.query;

  let query = supabase
    .from('clubs')
    .select('*, profiles(full_name, username)')
    .order('name', { ascending: true });

  if (category && category !== 'All') query = query.eq('category', category);
  if (q) query = query.ilike('name', `%${q}%`);

  const { data, error } = await query;

  if (error) throw error;

  res.status(200).json({
    success: true,
    clubs: data
  });
});

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
const getClub = asyncHandler(async (req, res) => {
  const { data: club, error } = await supabase
    .from('clubs')
    .select('*, profiles(full_name, username)')
    .eq('id', req.params.id)
    .single();

  if (error || !club) {
    res.status(404);
    throw new Error('Club not found');
  }

  res.status(200).json({
    success: true,
    club
  });
});

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private (Admin/Professor only ideally)
const createClub = asyncHandler(async (req, res) => {
  const { name, bio, category, logo_url, banner_url } = req.body;

  const { data: club, error } = await supabase
    .from('clubs')
    .insert({
      name,
      bio,
      category,
      logo_url,
      banner_url,
      creator_id: req.user.id
    })
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    club
  });
});

module.exports = {
  getClubs,
  getClub,
  createClub
};
