
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*, profiles!actor_id(full_name, avatar_url)')
    .eq('recipient_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  const { count: unreadCount, error: countError } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', req.user.id)
    .eq('is_read', false);

  if (countError) throw countError;

  res.status(200).json({
    success: true,
    notifications,
    unreadCount
  });
});

// @desc    Mark all read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllRead = asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', req.user.id)
    .eq('is_read', false);

  if (error) throw error;

  res.status(200).json({
    success: true
  });
});

module.exports = {
  getNotifications,
  markAllRead
};
