import pool from "../../utils/db";
import { TokenContent } from "../../types/postTypes";
import { Post } from "../../types/dbTypes";

/**
 * Get all posts from database
 */
export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const query = `
          SELECT 
            p.*,
            u.username,
            u.email
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.id
          ORDER BY p.created_at DESC
        `;

    const result = await pool.query(query);
    return result.rows;
  } catch (e) {
    console.error("fetchAllPosts error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get single post by id
 */
export const fetchPostById = async (id: number): Promise<Post | null> => {
  try {
    const query = `
    SELECT 
      p.*,
      u.username
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (e) {
    console.error("fetchPostById error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Create new post
 */
export const createPost = async (
  post: Omit<Post, "id" | "created_at" | "updated_at">
): Promise<Post | null> => {
  try {
    const result = await pool.query<Post>(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [post.title, post.content, post.user_id]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("createPost error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update existing post
 */
export const updatePost = async (
  id: number,
  post: Partial<Post>,
  user: TokenContent
): Promise<Post | null> => {
  try {
    const result = await pool.query<Post>(
      "UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *",
      [post.title, post.content, id, user.user_id]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("updatePost error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete post
 */
export const deletePost = async (
  id: number,
  user: TokenContent
): Promise<boolean> => {
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [id, user.user_id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (e) {
    console.error("deletePost error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};
