const request = require("supertest");
const app = require("../src/app");
const { ROLES } = require("../src/constants/roles");
const { createUser } = require("./helpers");

describe("Role-based access control", () => {
  test("viewer cannot create a record", async () => {
    const { token } = await createUser({
      name: "Viewer User",
      email: "viewer-rbac@test.local",
      role: ROLES.VIEWER,
    });

    const response = await request(app)
      .post("/api/v1/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 1000,
        type: "income",
        category: "Salary",
        date: "2026-04-01",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Forbidden: insufficient permissions");
  });

  test("admin can create a record", async () => {
    const { token, user } = await createUser({
      name: "Admin User",
      email: "admin-rbac@test.local",
      role: ROLES.ADMIN,
    });

    const response = await request(app)
      .post("/api/v1/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 1000,
        type: "income",
        category: "Salary",
        date: "2026-04-01",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.amount).toBe(1000);
    expect(response.body.data.created_by).toBe(String(user._id));
  });

  test("admin can update another user's role", async () => {
    const { token } = await createUser({
      name: "Admin User",
      email: "admin-user-mgmt@test.local",
      role: ROLES.ADMIN,
    });
    const { user } = await createUser({
      name: "Viewer User",
      email: "viewer-user-mgmt@test.local",
      role: ROLES.VIEWER,
    });

    const response = await request(app)
      .patch(`/api/v1/users/${user._id}/role`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: ROLES.ANALYST });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.role).toBe(ROLES.ANALYST);
  });
});
