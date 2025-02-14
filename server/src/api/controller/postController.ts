import { Request, Response, NextFunction } from "express";
import pool from "../../utils/db";
import {
  Post,
  TokenContent,
  PostResponse,
  MessageResponse,
} from "../../types/postTypes";
import CustomError from "../../classes/CustomError";

/**
 * Get all posts controller
 */
const getAllPosts = async (
  req: Request,
  res: Response<Post[]>,
  next: NextFunction
) => {
  try {
    const result = await pool.query<Post>(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    if (result.rows.length === 0) {
      const error = new CustomError("No posts found", 404);
      next(error);
      return;
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single post controller
 */
const getPostById = async (
  req: Request<{ id: string }>,
  res: Response<Post>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query<Post>("SELECT * FROM posts WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      const error = new CustomError("Post not found", 404);
      next(error);
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Create post controller
 */
const createPost = async (
  req: Request<{}, {}, Omit<Post, "id" | "created_at" | "updated_at">>,
  res: Response<PostResponse, { user: TokenContent }>,
  next: NextFunction
) => {
  try {
    req.body.user_id = res.locals.user.user_id;
    const result = await pool.query<Post>(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [req.body.title, req.body.content, req.body.user_id]
    );

    if (result.rows.length === 0) {
      const error = new CustomError("Post creation failed", 500);
      next(error);
      return;
    }
    res
      .status(201)
      .json({ message: "Post created successfully", post: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * Update post controller
 */
const updatePost = async (
  req: Request<{ id: string }, {}, Partial<Post>>,
  res: Response<PostResponse, { user: TokenContent }>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query<Post>(
      "UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *",
      [req.body.title, req.body.content, id, res.locals.user.user_id]
    );

    if (result.rows.length === 0) {
      const error = new CustomError("Post update failed", 404);
      next(error);
      return;
    }
    res.json({ message: "Post updated successfully", post: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post controller
 */
const deletePost = async (
  req: Request<{ id: string }>,
  res: Response<MessageResponse, { user: TokenContent }>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [id, res.locals.user.user_id]
    );

    if (result.rowCount === 0) {
      const error = new CustomError("Post not found or unauthorized", 404);
      next(error);
      return;
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
