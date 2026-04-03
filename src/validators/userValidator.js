const { body, param } = require("express-validator");
const { ROLES, USER_STATUS } = require("../constants/roles");

const userIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),
];

const updateRoleValidator = [
  ...userIdParamValidator,
  body("role")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role. Allowed: viewer | analyst | admin"),
];

const updateStatusValidator = [
  ...userIdParamValidator,
  body("status")
    .isIn(Object.values(USER_STATUS))
    .withMessage("Invalid status. Allowed: active | inactive"),
];

module.exports = {
  updateRoleValidator,
  updateStatusValidator,
};
