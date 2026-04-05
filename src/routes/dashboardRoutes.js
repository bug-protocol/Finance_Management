const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { dashboardSummaryValidator } = require("../validators/dashboardValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get(
  "/summary",
  authenticate,
  authorizeRoles(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  dashboardSummaryValidator,
  validate,
  dashboardController.getSummary
);

module.exports = router;
