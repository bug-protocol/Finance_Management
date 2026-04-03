const FinancialRecord = require("../models/FinancialRecord");
const ApiError = require("../utils/apiError");

const buildRecordFilter = (query) => {
  const filter = { is_deleted: false };

  if (query.type) filter.type = query.type;
  if (query.category) filter.category = { $regex: query.category, $options: "i" };
  if (query.created_by) filter.created_by = query.created_by;
  if (query.search) {
    filter.$or = [
      { category: { $regex: query.search, $options: "i" } },
      { notes: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  return filter;
};

const createRecord = async (payload, creatorId) => {
  const data = { ...payload, created_by: payload.created_by || creatorId };
  return FinancialRecord.create(data);
};

const getRecords = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = buildRecordFilter(query);

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate("created_by", "name email role")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getRecordById = async (id) => {
  const record = await FinancialRecord.findOne({ _id: id, is_deleted: false }).populate(
    "created_by",
    "name email role"
  );
  if (!record) throw new ApiError(404, "Record not found");
  return record;
};

const updateRecord = async (id, payload) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: id, is_deleted: false },
    payload,
    { new: true }
  ).populate("created_by", "name email role");

  if (!record) throw new ApiError(404, "Record not found");
  return record;
};

const deleteRecord = async (id) => {
  const record = await FinancialRecord.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!record) throw new ApiError(404, "Record not found");
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
