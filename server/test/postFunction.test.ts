import request from "supertest";
import app from "../src/app";
import pool from "../src/utils/db";

describe("Post Endpoints", () => {
  let authToken: string;
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    // Create test user and get token
    const userRes = await request(app)
      .post("/api/v1/user")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    authToken = userRes.body.token;
    userId = userRes.body.user.id;

    // Create test post
    const postRes = await request(app)
      .post("/api/v1/post")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Post",
        content: "This is a test post"
      });

    postId = postRes.body.post.id;
  });

  afterAll(async () => {
    // Only delete test data
    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    await pool.end();
  });

  it("should get all posts", async () => {
    const res = await request(app)
      .get("/api/v1/post")
      .expect(200);

    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].title).toBe("Test Post");
  });

  it("should get post by id", async () => {
    const res = await request(app)
      .get(`/api/v1/post/${postId}`)
      .expect(200);

    expect(res.body.title).toBe("Test Post");
    expect(res.body.user_id).toBe(userId);
  });

  it("should delete post", async () => {
    await request(app)
      .delete(`/api/v1/post/${postId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    await request(app)
      .get(`/api/v1/post/${postId}`)
      .expect(404);
  });
});