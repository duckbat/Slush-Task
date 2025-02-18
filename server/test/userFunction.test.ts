import request from "supertest";
import app from "../src/app";
import pool from "../src/utils/db";

describe("User Endpoints", () => {
  let testUser = {
    id: 0,
    username: "testuser3",
    email: "test3@example.com",
    password: "password123",
  };
  let authToken: string;

  // Create a test user and get auth token before all tests
  beforeAll(async () => {
    // Create user
    const createRes = await request(app).post("/api/v1/user").send(testUser);

    if (createRes.status === 201) {
      testUser.id = createRes.body.user.id;
    }

    // Login to get token
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        username: testUser.username,
        password: testUser.password,
      });

    authToken = loginRes.body.token;
  });

  // Clean up after all tests
  afterAll(async () => {
    if (testUser.id) {
      await pool.query("DELETE FROM users WHERE id = $1", [testUser.id]);
    }
    await pool.end();
  });

  // Test getting all users
  it("should get all users", async () => {
    const res = await request(app).get("/api/v1/user").expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
    expect(
      res.body.some(
        (user: { username: string }) => user.username === testUser.username
      )
    ).toBeTruthy();
  });

  // Test getting a single user by ID
  it("should get user by id", async () => {
    const res = await request(app)
      .get(`/api/v1/user/${testUser.id}`)
      .expect(200);

    expect(res.body.username).toBe(testUser.username);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body).not.toHaveProperty("password");
  });

  // Test user deletion with token
  it("should delete user with valid token", async () => {
    // Delete user with token
    await request(app)
      .delete("/api/v1/user")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    // Verify user is deleted
    const res = await request(app)
      .get(`/api/v1/user/${testUser.id}`)
      .expect(404);
  });

  // Test user deletion without token
  it("should not delete user without token", async () => {
    await request(app)
      .delete("/api/v1/user")
      .expect(401);
  });
});
