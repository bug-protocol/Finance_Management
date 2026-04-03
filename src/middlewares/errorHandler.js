const ApiError = require("../utils/apiError");
const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return errorResponse(res, err.statusCode, err.message, err.details);
  }

  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid resource identifier");
  }

  if (err.code === 11000) {
    return errorResponse(res, 400, "Duplicate value error", err.keyValue);
  }

  return errorResponse(res, 500, "Internal server error");
};

module.exports = errorHandler;
