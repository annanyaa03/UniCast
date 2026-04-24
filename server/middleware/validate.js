const logger = require('../config/logger');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      req.validatedData = parsed;
      next();
    } catch (err) {
      if (err.name === 'ZodError') {
        const errors = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors,
        });

        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }

      logger.error('Validation middleware error', { error: err.message });
      next(err);
    }
  };
};

module.exports = validate;
