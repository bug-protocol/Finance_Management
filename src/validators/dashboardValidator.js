const { query } = require("express-validator");

const dashboardSummaryValidator = [
  query("created_by").optional().isMongoId().withMessage("Invalid created_by user id"),
  query("startDate").optional().isISO8601().withMessage("startDate must be a valid ISO date"),
  query("endDate").optional().isISO8601().withMessage("endDate must be a valid ISO date"),
  query("endDate").custom((value, { req }) => {
    if (!value || !req.query.startDate) return true;

    const startDate = new Date(req.query.startDate);
    const endDate = new Date(value);

    if (endDate < startDate) {
      throw new Error("endDate must be greater than or equal to startDate");
    }

    return true;
  }),
];

module.exports = {
  dashboardSummaryValidator,
};
