const supabase = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const { category, q } = req.query;

  let query = supabase
    .from('events')
    .select('*, profiles(full_name, username), clubs(name, logo_url)')
    .order('date', { ascending: true });

  if (category && category !== 'All') query = query.eq('category', category);
  if (q) query = query.ilike('title', `%${q}%`);

  const { data, error } = await query;

  if (error) throw error;

  res.status(200).json({
    success: true,
    events: data
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res) => {
  const { data: event, error } = await supabase
    .from('events')
    .select('*, profiles(full_name, username), clubs(name, logo_url)')
    .eq('id', req.params.id)
    .single();

  if (error || !event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json({
    success: true,
    event
  });
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private (ClubAdmin/Admin/Professor)
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue, category, image_url, club_id } = req.body;

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      date,
      venue,
      category,
      image_url,
      club_id,
      creator_id: req.user.id
    })
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    event
  });
});

module.exports = {
  getEvents,
  getEvent,
  createEvent
};
