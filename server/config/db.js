const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('MongoDB Connected', {
      host: conn.connection.host,
      database: conn.connection.name,
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
