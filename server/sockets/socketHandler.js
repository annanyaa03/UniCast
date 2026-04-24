const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 30000,
    pingInterval: 25000,
  });

  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('_id fullName username avatar role');

      if (!user) return next(new Error('User not found'));
      if (user.isBanned) return next(new Error('Account banned'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    logger.info('Socket connected', { userId, socketId: socket.id });

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    // Join video room
    socket.on('video:join', (videoId) => {
      socket.join(`video:${videoId}`);
      logger.debug('User joined video room', { userId, videoId });
    });

    socket.on('video:leave', (videoId) => {
      socket.leave(`video:${videoId}`);
    });

    // Live stream rooms
    socket.on('live:join', (streamId) => {
      socket.join(`live:${streamId}`);
      io.to(`live:${streamId}`).emit('live:viewerCount', {
        streamId,
        count: io.sockets.adapter.rooms.get(`live:${streamId}`)?.size || 0,
      });
    });

    socket.on('live:leave', (streamId) => {
      socket.leave(`live:${streamId}`);
      io.to(`live:${streamId}`).emit('live:viewerCount', {
        streamId,
        count: io.sockets.adapter.rooms.get(`live:${streamId}`)?.size || 0,
      });
    });

    // Live chat
    socket.on('live:message', (data) => {
      const { streamId, message } = data;
      if (!message || message.trim().length === 0) return;
      if (message.length > 200) return;

      io.to(`live:${streamId}`).emit('live:message', {
        userId,
        username: socket.user.username,
        fullName: socket.user.fullName,
        avatar: socket.user.avatar,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicators for comments
    socket.on('comment:typing', (videoId) => {
      socket.to(`video:${videoId}`).emit('comment:typing', { userId, username: socket.user.username });
    });

    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected', { userId, socketId: socket.id, reason });
    });
  });

  return io;
};

const getSocket = () => io;

module.exports = { initSocket, getSocket };
