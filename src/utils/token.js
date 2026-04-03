const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const generateToken = (payload) =>
  jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

module.exports = {
  generateToken,
};
