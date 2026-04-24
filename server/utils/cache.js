const { getRedis } = require('../config/redis');
const logger = require('../config/logger');

const DEFAULT_TTL = 300; // 5 minutes

const cache = {
  async get(key) {
    try {
      const redis = getRedis();
      if (!redis) return null;
      const data = await redis.get(key);
      if (data) {
        logger.debug('Cache hit', { key });
        return JSON.parse(data);
      }
      logger.debug('Cache miss', { key });
      return null;
    } catch (err) {
      logger.error('Cache get error', { key, error: err.message });
      return null;
    }
  },

  async set(key, data, ttlSeconds = DEFAULT_TTL) {
    try {
      const redis = getRedis();
      if (!redis) return false;
      await redis.setEx(key, ttlSeconds, JSON.stringify(data));
      logger.debug('Cache set', { key, ttl: ttlSeconds });
      return true;
    } catch (err) {
      logger.error('Cache set error', { key, error: err.message });
      return false;
    }
  },

  async del(key) {
    try {
      const redis = getRedis();
      if (!redis) return false;
      await redis.del(key);
      logger.debug('Cache deleted', { key });
      return true;
    } catch (err) {
      logger.error('Cache delete error', { key, error: err.message });
      return false;
    }
  },

  async delPattern(pattern) {
    try {
      const redis = getRedis();
      if (!redis) return false;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(keys);
        logger.debug('Cache pattern deleted', { pattern, count: keys.length });
      }
      return true;
    } catch (err) {
      logger.error('Cache pattern delete error', { pattern, error: err.message });
      return false;
    }
  },

  async remember(key, ttlSeconds, fetchFn) {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    const fresh = await fetchFn();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  },

  keys: {
    videoFeed: (page, category) => `videos:feed:${category || 'all'}:page:${page}`,
    videoDetail: (id) => `videos:detail:${id}`,
    trending: () => `videos:trending`,
    shorts: (page) => `videos:shorts:page:${page}`,
    channelVideos: (userId, page) => `channel:${userId}:videos:page:${page}`,
    userProfile: (id) => `users:profile:${id}`,
    clubList: (page) => `clubs:list:page:${page}`,
    clubDetail: (id) => `clubs:detail:${id}`,
    eventList: (page) => `events:list:page:${page}`,
    eventDetail: (id) => `events:detail:${id}`,
    searchResults: (query, page) => `search:${query}:page:${page}`,
    notifications: (userId) => `notifications:${userId}`,
  },
};

module.exports = cache;
