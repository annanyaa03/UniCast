const { createClient } = require('redis');
const logger = require('./logger');

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      logger.error('Redis client error', { error: err.message });
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    await redisClient.connect();

    logger.info('Redis Connected', { url: process.env.REDIS_URL || 'redis://localhost:6379' });
  } catch (err) {
    logger.error('Redis connection failed', { error: err.message });
    // Redis is optional — app continues without caching
    redisClient = null;
  }
};

const getRedis = () => redisClient;

module.exports = connectRedis;
module.exports.getRedis = getRedis;
