const User = require("../models/User");
const ApiError = require("../utils/apiError");

const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateUserStatus = async (userId, status) => {
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

module.exports = {
  updateUserRole,
  updateUserStatus,
};
