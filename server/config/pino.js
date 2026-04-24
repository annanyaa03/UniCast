const pino = require('pino');

const pinoLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '[UniCast] {msg}',
            levelFirst: true,
          },
        }
      : undefined,
  base: {
    service: 'unicast-api',
    env: process.env.NODE_ENV,
    version: '1.0.0',
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.confirmPassword',
      'req.body.currentPassword',
      'req.body.newPassword',
      '*.password',
      '*.token',
      '*.secret',
      '*.accessToken',
      '*.refreshToken',
    ],
    remove: true,
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = pinoLogger;
