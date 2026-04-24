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
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'UniCast API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
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
