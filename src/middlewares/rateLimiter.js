const rateLimit = require("express-rate-limit");
const { rateLimitWindowMs, rateLimitMax } = require("../config/env");

const apiRateLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

module.exports = apiRateLimiter;
