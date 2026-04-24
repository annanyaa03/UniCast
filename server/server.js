const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const logger = require('./config/logger');
const pinoLogger = require('./config/pino');
const connectDB = require('./config/db');
const connectRedis = require('./config/redis');
const { initSocket } = require('./sockets/socketHandler');
const errorHandler = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const {
  globalLimiter,
  authLimiter,
  uploadLimiter,
} = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');
const clubRoutes = require('./routes/clubs');
const eventRoutes = require('./routes/events');
const searchRoutes = require('./routes/search');
const playlistRoutes = require('./routes/playlists');
const liveRoutes = require('./routes/live');
const adminRoutes = require('./routes/admin');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');

const uploadsTemp = path.join(__dirname, 'uploads/temp');
if (!fs.existsSync(uploadsTemp)) {
  fs.mkdirSync(uploadsTemp, { recursive: true });
}

const app = express();
const server = http.createServer(app);

connectDB();
connectRedis();
initSocket(server);

app.use(requestId);

// Security
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
      scriptSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/videos/upload', uploadLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

// HTTP Request logging with Pino
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    pinoLogger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    }, 'HTTP Request');
  });
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
const mongoose = require('mongoose');
const os = require('os');

app.get('/health', async (req, res) => {
  const startTime = Date.now();

  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  let redisStatus = 'disconnected';
  let redisLatency = null;
  try {
    const { getRedis } = require('./config/redis');
    const redis = getRedis();
    if (redis) {
      const pingStart = Date.now();
      await redis.ping();
      redisLatency = `${Date.now() - pingStart}ms`;
      redisStatus = 'connected';
    }
  } catch {}

  const dbLatency = dbStatus === 'connected' ? `${Date.now() - startTime}ms` : null;

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const allHealthy = dbStatus === 'connected' && redisStatus === 'connected';

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    service: 'UniCast API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    responseTime: `${Date.now() - startTime}ms`,
    services: {
      database: {
        status: dbStatus,
        latency: dbLatency,
        name: 'MongoDB',
      },
      cache: {
        status: redisStatus,
        latency: redisLatency,
        name: 'Redis',
      },
    },
    memory: {
      used: `${Math.round(usedMemory / 1024 / 1024)} MB`,
      free: `${Math.round(freeMemory / 1024 / 1024)} MB`,
      total: `${Math.round(totalMemory / 1024 / 1024)} MB`,
      percentage: `${Math.round((usedMemory / totalMemory) * 100)}%`,
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT) || 5000;

server.listen(PORT, () => {
  logger.info(`UniCast API running`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    pid: process.pid,
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { reason, promise });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = { app, server };
