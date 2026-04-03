const express = require("express");
const recordController = require("../controllers/recordController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  createRecordValidator,
  updateRecordValidator,
  recordIdParamValidator,
  getRecordsQueryValidator,
} = require("../validators/recordValidator");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  createRecordValidator,
  validate,
  recordController.createRecord
);

router.get(
  "/",
  authenticate,
  authorizeRoles(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  getRecordsQueryValidator,
  validate,
  recordController.getRecords
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  recordIdParamValidator,
  validate,
  recordController.getRecordById
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  updateRecordValidator,
  validate,
  recordController.updateRecord
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  recordIdParamValidator,
  validate,
  recordController.deleteRecord
);

module.exports = router;
