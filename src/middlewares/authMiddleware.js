const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const User = require("../models/User");
const { USER_STATUS } = require("../constants/roles");
const ApiError = require("../utils/apiError");

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized: token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.userId).select("-password");

    if (!user) return next(new ApiError(401, "Unauthorized: user not found"));
    if (user.status !== USER_STATUS.ACTIVE) {
      return next(new ApiError(403, "Forbidden: inactive user"));
    }

    req.user = user;
    return next();
  } catch (_err) {
    return next(new ApiError(401, "Unauthorized: invalid token"));
  }
};

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, "Unauthorized"));
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden: insufficient permissions"));
  }
  return next();
};

module.exports = {
  authenticate,
  authorizeRoles,
};
