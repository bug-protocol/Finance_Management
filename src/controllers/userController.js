const userService = require("../services/userService");
const { successResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const updateRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return successResponse(res, 200, "User role updated successfully", user);
});

const updateStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status);
  return successResponse(res, 200, "User status updated successfully", user);
});

module.exports = {
  updateRole,
  updateStatus,
};
