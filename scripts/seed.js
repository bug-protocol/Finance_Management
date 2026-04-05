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

    const seededUsers = [];

    seededUsers.push(
      await User.create({
        name: "Admin User",
        email: "admin@finance.local",
        password: "Password123",
        role: "admin",
        status: "active",
      })
    );
    seededUsers.push(
      await User.create({
        name: "Finance Analyst",
        email: "analyst@finance.local",
        password: "Password123",
        role: "analyst",
        status: "active",
      })
    );
    seededUsers.push(
      await User.create({
        name: "Read Only Viewer",
        email: "viewer@finance.local",
        password: "Password123",
        role: "viewer",
        status: "active",
      })
    );
    seededUsers.push(
      await User.create({
        name: "Inactive Viewer",
        email: "inactive.viewer@finance.local",
        password: "Password123",
        role: "viewer",
        status: "inactive",
      })
    );

    const admin = seededUsers.find((user) => user.role === "admin");
    const analyst = seededUsers.find((user) => user.role === "analyst");
    const viewer = seededUsers.find((user) => user.email === "viewer@finance.local");

    const records = [
      {
        amount: 5200,
        type: "income",
        category: "Salary",
        date: new Date("2026-01-02"),
        notes: "January salary credit",
        created_by: admin._id,
      },
      {
        amount: 1500,
        type: "expense",
        category: "Rent",
        date: new Date("2026-01-05"),
        notes: "Apartment rent",
        created_by: admin._id,
      },
      {
        amount: 420,
        type: "expense",
        category: "Groceries",
        date: new Date("2026-01-11"),
        notes: "Weekly grocery run",
        created_by: admin._id,
      },
      {
        amount: 850,
        type: "income",
        category: "Freelance",
        date: new Date("2026-01-18"),
        notes: "API consulting project",
        created_by: admin._id,
      },
      {
        amount: 5400,
        type: "income",
        category: "Salary",
        date: new Date("2026-02-01"),
        notes: "February salary credit",
        created_by: analyst._id,
      },
      {
        amount: 275,
        type: "expense",
        category: "Transport",
        date: new Date("2026-02-04"),
        notes: "Fuel and metro top up",
        created_by: analyst._id,
      },
      {
        amount: 640,
        type: "expense",
        category: "Utilities",
        date: new Date("2026-02-09"),
        notes: "Electricity and internet bills",
        created_by: analyst._id,
      },
      {
        amount: 320,
        type: "expense",
        category: "Dining",
        date: new Date("2026-02-14"),
        notes: "Team dinner",
        created_by: analyst._id,
      },
      {
        amount: 5300,
        type: "income",
        category: "Salary",
        date: new Date("2026-03-01"),
        notes: "March salary credit",
        created_by: viewer._id,
      },
      {
        amount: 1100,
        type: "expense",
        category: "Insurance",
        date: new Date("2026-03-06"),
        notes: "Quarterly premium payment",
        created_by: viewer._id,
      },
      {
        amount: 210,
        type: "expense",
        category: "Entertainment",
        date: new Date("2026-03-12"),
        notes: "Streaming and movie tickets",
        created_by: viewer._id,
      },
      {
        amount: 1250,
        type: "income",
        category: "Bonus",
        date: new Date("2026-03-20"),
        notes: "Quarterly performance bonus",
        created_by: admin._id,
      },
    ];

    await FinancialRecord.insertMany(records);

    // eslint-disable-next-line no-console
    console.log("Seed completed successfully.");
    // eslint-disable-next-line no-console
    console.table(
      seededUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: "Password123",
      }))
    );
    // eslint-disable-next-line no-console
    console.log(`Seeded ${records.length} financial records.`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
