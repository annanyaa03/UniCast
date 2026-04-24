
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Subscribe to a channel
// @route   POST /api/users/:id/subscribe
// @access  Private
const subscribe = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    res.status(400);
    throw new Error('You cannot subscribe to yourself');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      subscriber_id: req.user.id,
      channel_id: req.params.id
    });

  if (error) {
    if (error.code === '23505') { // Unique violation
        // Unsubscribe
        await supabase
          .from('subscriptions')
          .delete()
          .match({ subscriber_id: req.user.id, channel_id: req.params.id });
        
        return res.status(200).json({ success: true, subscribed: false });
    }
    throw error;
  }

  // Create notification
  await supabase
    .from('notifications')
    .insert({
      recipient_id: req.params.id,
      actor_id: req.user.id,
      type: 'subscribe',
      message: `${req.user.user_metadata.full_name} subscribed to your channel`,
      link: `/channel/${req.user.id}`
    });

  res.status(201).json({
    success: true,
    subscribed: true
  });
});

module.exports = {
  getUser,
  subscribe
};
