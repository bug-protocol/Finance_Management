const successResponse = (res, statusCode, message, data = null, meta = null) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });

const errorResponse = (res, statusCode, message, details = null) =>
  res.status(statusCode).json({
    success: false,
    message,
    details,
  });

module.exports = {
  successResponse,
  errorResponse,
};
