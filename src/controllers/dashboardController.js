const dashboardService = require("../services/dashboardService");
const { successResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.query);
  return successResponse(res, 200, "Dashboard summary fetched successfully", summary);
});

module.exports = {
  getSummary,
};
