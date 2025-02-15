import pool from "../src/utils/db";

export interface DBState {
  users: any[];
  posts: any[];
}

export const saveDBState = async (): Promise<DBState> => {
  const usersResult = await pool.query("SELECT * FROM users");
  const postsResult = await pool.query("SELECT * FROM posts");
  return {
    users: usersResult.rows,
    posts: postsResult.rows,
  };
};

export const restoreDBState = async (state: DBState) => {
  await pool.query("DELETE FROM posts");
  await pool.query("DELETE FROM users");

  if (state.users.length > 0) {
    for (const user of state.users) {
      await pool.query(
        "INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5)",
        [user.id, user.username, user.email, user.password, user.created_at]
      );
    }
  }

  if (state.posts.length > 0) {
    for (const post of state.posts) {
      await pool.query(
        "INSERT INTO posts (id, title, content, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          post.id,
          post.title,
          post.content,
          post.user_id,
          post.created_at,
          post.updated_at,
        ]
      );
    }
  }
};
