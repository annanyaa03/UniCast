const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}, meta = {}) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = []) => {
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendPaginated = (res, message = 'Fetched successfully', data = [], pagination = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 12,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 12)),
      hasNext: pagination.hasNext || false,
      hasPrev: (pagination.page || 1) > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
