const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorizeRoles(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  dashboardController.getSummary
);

module.exports = router;
