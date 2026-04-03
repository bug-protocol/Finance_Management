const User = require("../models/User");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/token");

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already exists");

  const user = await User.create({ name, email, password, role });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");
  if (user.status !== "active") throw new ApiError(403, "User is inactive");

  const token = generateToken({ userId: user._id, role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

module.exports = {
  register,
  login,
};
