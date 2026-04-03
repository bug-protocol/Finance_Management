const { body, param, query } = require("express-validator");

const recordIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid record id"),
];

const createRecordValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("created_by").optional().isMongoId().withMessage("created_by must be a valid user id"),
];

const updateRecordValidator = [
  ...recordIdParamValidator,
  body("amount").optional().isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
  body("type").optional().isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
];

const getRecordsQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("type").optional().isIn(["income", "expense"]).withMessage("type must be income or expense"),
  query("created_by").optional().isMongoId().withMessage("Invalid created_by user id"),
  query("startDate").optional().isISO8601().withMessage("startDate must be valid ISO date"),
  query("endDate").optional().isISO8601().withMessage("endDate must be valid ISO date"),
];

module.exports = {
  recordIdParamValidator,
  createRecordValidator,
  updateRecordValidator,
  getRecordsQueryValidator,
};
