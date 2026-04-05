const request = require("supertest");
const app = require("../src/app");
const { ROLES, USER_STATUS } = require("../src/constants/roles");

describe("Authentication", () => {
  test("register creates a viewer even if admin role is submitted", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "Escalation Attempt",
      email: "viewer@test.local",
      password: "Password123",
      role: ROLES.ADMIN,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.user.role).toBe(ROLES.VIEWER);
  });

  test("login rejects inactive users", async () => {
    const User = require("../src/models/User");

    await User.create({
      name: "Inactive User",
      email: "inactive@test.local",
      password: "Password123",
      role: ROLES.VIEWER,
      status: USER_STATUS.INACTIVE,
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "inactive@test.local",
      password: "Password123",
    });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("User is inactive");
  });

  test("invalid login payload fails validation", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "invalid-email",
    });

    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe("Validation failed");
  });
});
