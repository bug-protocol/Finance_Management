const FinancialRecord = require("../models/FinancialRecord");

const buildCommonMatch = (query) => {
  const match = { is_deleted: false };
  if (query.created_by) match.created_by = query.created_by;
  if (query.startDate || query.endDate) {
    match.date = {};
    if (query.startDate) match.date.$gte = new Date(query.startDate);
    if (query.endDate) match.date.$lte = new Date(query.endDate);
  }
  return match;
};

const getSummary = async (query) => {
  const match = buildCommonMatch(query);

  const [
    incomeAgg,
    expenseAgg,
    categoryTotals,
    monthlyTrends,
    recentTransactions,
  ] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: { ...match, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    FinancialRecord.aggregate([
      { $match: { ...match, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      { $group: { _id: { category: "$category", type: "$type" }, total: { $sum: "$amount" } } },
      { $sort: { "_id.category": 1 } },
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
    FinancialRecord.find(match)
      .populate("created_by", "name email")
      .sort({ date: -1, createdAt: -1 })
      .limit(10),
  ]);

  const totalIncome = incomeAgg[0]?.total || 0;
  const totalExpenses = expenseAgg[0]?.total || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryTotals,
    monthlyTrends,
    recentTransactions,
  };
};

module.exports = {
  getSummary,
};
