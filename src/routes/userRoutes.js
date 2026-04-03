const express = require("express");
const userController = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { updateRoleValidator, updateStatusValidator } = require("../validators/userValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.patch(
  "/:id/role",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  updateRoleValidator,
  validate,
  userController.updateRole
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  updateStatusValidator,
  validate,
  userController.updateStatus
);

module.exports = router;
