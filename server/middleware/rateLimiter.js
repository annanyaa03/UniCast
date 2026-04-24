const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const createLimiter = (windowMinutes, max, message) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      res.status(429).json({ error: options.message.error });
    },
  });
};

module.exports = {
  globalLimiter: createLimiter(15, 100, 'Too many requests. Please try again later.'),
  authLimiter: createLimiter(15, 10, 'Too many authentication attempts. Please try again in 15 minutes.'),
  uploadLimiter: createLimiter(60, 20, 'Upload limit reached. Please try again in an hour.'),
  searchLimiter: createLimiter(1, 30, 'Too many search requests. Please slow down.'),
  commentLimiter: createLimiter(1, 20, 'Too many comments. Please slow down.'),
};
