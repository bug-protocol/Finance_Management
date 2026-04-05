const request = require("supertest");
const app = require("../src/app");
const { ROLES } = require("../src/constants/roles");
const { createRecord, createUser } = require("./helpers");

describe("Financial records", () => {
  test("invalid record input fails validation", async () => {
    const { token } = await createUser({
      name: "Admin Validation",
      email: "admin-validation@test.local",
      role: ROLES.ADMIN,
    });

    const response = await request(app)
      .post("/api/v1/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: -50,
        type: "income",
        category: "",
        date: "not-a-date",
      });

    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe("Validation failed");
  });

  test("records list supports pagination and filters", async () => {
    const { token, user } = await createUser({
      name: "Admin Records",
      email: "admin-records@test.local",
      role: ROLES.ADMIN,
    });

    await Promise.all([
      createRecord({
        amount: 1200,
        type: "income",
        category: "Salary",
        date: new Date("2026-04-01"),
        created_by: user._id,
      }),
      createRecord({
        amount: 200,
        type: "expense",
        category: "Food",
        date: new Date("2026-04-02"),
        created_by: user._id,
      }),
      createRecord({
        amount: 300,
        type: "expense",
        category: "Food",
        date: new Date("2026-04-03"),
        created_by: user._id,
      }),
    ]);

    const response = await request(app)
      .get("/api/v1/records?type=expense&category=foo&page=1&limit=1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(2);
    expect(response.body.meta.totalPages).toBe(2);
  });

  test("admin can soft delete a record", async () => {
    const { token, user } = await createUser({
      name: "Admin Delete",
      email: "admin-delete@test.local",
      role: ROLES.ADMIN,
    });
    const record = await createRecord({
      amount: 400,
      type: "expense",
      category: "Bills",
      created_by: user._id,
    });

    const deleteResponse = await request(app)
      .delete(`/api/v1/records/${record._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.statusCode).toBe(200);

    const listResponse = await request(app)
      .get("/api/v1/records")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.data).toHaveLength(0);
  });
});
