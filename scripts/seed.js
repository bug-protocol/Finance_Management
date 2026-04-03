const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const FinancialRecord = require("../src/models/FinancialRecord");

dotenv.config();

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@finance.local",
        password: "Password123",
        role: "admin",
        status: "active",
      },
      {
        name: "Analyst User",
        email: "analyst@finance.local",
        password: "Password123",
        role: "analyst",
        status: "active",
      },
      {
        name: "Viewer User",
        email: "viewer@finance.local",
        password: "Password123",
        role: "viewer",
        status: "active",
      },
    ]);

    const adminId = users.find((u) => u.role === "admin")._id;

    await FinancialRecord.create([
      {
        amount: 2500,
        type: "income",
        category: "Salary",
        date: new Date("2026-03-01"),
        notes: "Monthly salary",
        created_by: adminId,
      },
      {
        amount: 350,
        type: "expense",
        category: "Groceries",
        date: new Date("2026-03-03"),
        notes: "Supermarket purchase",
        created_by: adminId,
      },
      {
        amount: 120,
        type: "expense",
        category: "Transport",
        date: new Date("2026-03-07"),
        notes: "Fuel",
        created_by: adminId,
      },
      {
        amount: 500,
        type: "income",
        category: "Freelance",
        date: new Date("2026-03-10"),
        notes: "Side project",
        created_by: adminId,
      },
    ]);

    // eslint-disable-next-line no-console
    console.log("Seed completed successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
