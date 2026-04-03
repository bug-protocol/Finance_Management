const recordService = require("../services/recordService");
const { successResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createRecord = asyncHandler(async (req, res) => {
  const record = await recordService.createRecord(req.body, req.user._id);
  return successResponse(res, 201, "Record created successfully", record);
});

const getRecords = asyncHandler(async (req, res) => {
  const result = await recordService.getRecords(req.query);
  return successResponse(res, 200, "Records fetched successfully", result.records, result.pagination);
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await recordService.getRecordById(req.params.id);
  return successResponse(res, 200, "Record fetched successfully", record);
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await recordService.updateRecord(req.params.id, req.body);
  return successResponse(res, 200, "Record updated successfully", record);
});

const deleteRecord = asyncHandler(async (req, res) => {
  await recordService.deleteRecord(req.params.id);
  return successResponse(res, 200, "Record deleted successfully");
});

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
