const { getRedis } = require('../config/redis');
const logger = require('../config/logger');

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60;
const ATTEMPT_WINDOW = 15 * 60;

exports.recordFailedAttempt = async (email) => {
  try {
    const redis = getRedis();
    if (!redis) return { locked: false, attempts: 0 };

    const key = `login:attempts:${email}`;
    const attempts = await redis.incr(key);

    if (attempts === 1) {
      await redis.expire(key, ATTEMPT_WINDOW);
    }

    if (attempts >= MAX_ATTEMPTS) {
      const lockKey = `login:locked:${email}`;
      await redis.setEx(lockKey, LOCKOUT_DURATION, '1');
      logger.warn('Account locked due to too many failed attempts', { email });
      return { locked: true, attempts };
    }

    return { locked: false, attempts, remaining: MAX_ATTEMPTS - attempts };
  } catch (err) {
    logger.error('Login attempt tracking error', { error: err.message });
    return { locked: false, attempts: 0 };
  }
};

exports.isAccountLocked = async (email) => {
  try {
    const redis = getRedis();
    if (!redis) return false;

    const lockKey = `login:locked:${email}`;
    const locked = await redis.get(lockKey);
    return !!locked;
  } catch (err) {
    logger.error('Account lock check error', { error: err.message });
    return false;
  }
};

exports.clearLoginAttempts = async (email) => {
  try {
    const redis = getRedis();
    if (!redis) return;

    await redis.del(`login:attempts:${email}`);
    await redis.del(`login:locked:${email}`);
  } catch (err) {
    logger.error('Clear login attempts error', { error: err.message });
  }
};
