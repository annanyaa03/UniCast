const { createClient } = require('@supabase/supabase-js');
const asyncHandler = require('../utils/asyncHandler');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    // Note: Suapbase roles are typically in user_metadata or row level security
    // We'll check the metadata for our custom 'role' field
    const userRole = req.user?.user_metadata?.role || req.user?.role || 'user';
    
    if (!roles.includes(userRole)) {
      res.status(403);
      throw new Error(`User role ${userRole} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { protect, authorize };
