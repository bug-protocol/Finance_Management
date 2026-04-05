const request = require("supertest");
const app = require("../src/app");
const { ROLES } = require("../src/constants/roles");
const { createRecord, createUser } = require("./helpers");

describe("Dashboard analytics", () => {
  test("analytics returns correct totals and recent transactions", async () => {
    const { token, user } = await createUser({
      name: "Analyst User",
      email: "analyst-dashboard@test.local",
      role: ROLES.ANALYST,
    });

    await Promise.all([
      createRecord({
        amount: 5000,
        type: "income",
        category: "Salary",
        date: new Date("2026-03-01"),
        created_by: user._id,
      }),
      createRecord({
        amount: 1200,
        type: "expense",
        category: "Rent",
        date: new Date("2026-03-05"),
        created_by: user._id,
      }),
      createRecord({
        amount: 300,
        type: "expense",
        category: "Groceries",
        date: new Date("2026-03-10"),
        created_by: user._id,
      }),
    ]);

    const response = await request(app)
      .get(`/api/v1/dashboard/summary?created_by=${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.totalIncome).toBe(5000);
    expect(response.body.data.totalExpenses).toBe(1500);
    expect(response.body.data.netBalance).toBe(3500);
    expect(response.body.data.categoryTotals).toHaveLength(3);
    expect(response.body.data.monthlyTrends).toHaveLength(2);
    expect(response.body.data.recentTransactions).toHaveLength(3);
  });

  test("dashboard rejects invalid date ranges", async () => {
    const { token } = await createUser({
      name: "Viewer User",
      email: "viewer-dashboard@test.local",
      role: ROLES.VIEWER,
    });

    const response = await request(app)
      .get("/api/v1/dashboard/summary?startDate=2026-04-10&endDate=2026-04-01")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe("Validation failed");
  });
});
