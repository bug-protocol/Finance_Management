const User = require("../src/models/User");
const FinancialRecord = require("../src/models/FinancialRecord");
const { ROLES, USER_STATUS } = require("../src/constants/roles");
const { generateToken } = require("../src/utils/token");

const createUser = async ({
  name = "Test User",
  email = `user-${Date.now()}-${Math.random()}@test.local`,
  password = "Password123",
  role = ROLES.VIEWER,
  status = USER_STATUS.ACTIVE,
} = {}) => {
  const user = await User.create({ name, email, password, role, status });
  const token = generateToken({ userId: user._id, role: user.role });

  return { user, token, password };
};

const createRecord = async ({
  amount = 100,
  type = "income",
  category = "General",
  date = new Date("2026-04-01"),
  notes = "",
  created_by,
} = {}) =>
  FinancialRecord.create({
    amount,
    type,
    category,
    date,
    notes,
    created_by,
  });

module.exports = {
  createUser,
  createRecord,
};
