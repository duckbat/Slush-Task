import { Request, Response, NextFunction } from "express";
import pool from "../../utils/db";
import CustomError from "../../classes/CustomError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, TokenContent } from "../../types/dbTypes";

/**
 * Get all users
 */
const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users"
    );
    if (result.rows.length === 0) {
      next(new CustomError("No users found", 404));
      return;
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      next(new CustomError("User not found", 404));
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 */
const createUser = async (
  req: Request<{}, {}, Pick<User, "username" | "email" | "password">>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [req.body.username, req.body.email, hashedPassword]
    );

    const token = jwt.sign(
      {
        user_id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
      token
    });
  } catch (error) {
    if ((error as any).code === "23505") {
      next(new CustomError("Username or email already exists", 400));
      return;
    }
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (
  req: Request<{}, {}, Partial<Pick<User, "username" | "email" | "password">>>,
  res: Response<{message: string, user: Partial<User>}, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (req.body.username) {
      updates.push(`username = $${paramCount}`);
      values.push(req.body.username);
      paramCount++;
    }
    if (req.body.email) {
      updates.push(`email = $${paramCount}`);
      values.push(req.body.email);
      paramCount++;
    }
    if (req.body.password) {
      updates.push(`password = $${paramCount}`);
      values.push(await bcrypt.hash(req.body.password, 10));
      paramCount++;
    }

    values.push(res.locals.user.user_id);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, username, email, created_at`,
      values
    );

    if (result.rows.length === 0) {
      next(new CustomError("User not found", 404));
      return;
    }

    res.json({
      message: "User updated successfully",
      user: result.rows[0]
    });
  } catch (error) {
    if ((error as any).code === "23505") {
      next(new CustomError("Username or email already exists", 400));
      return;
    }
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (
  _req: Request,
  res: Response<{message: string}, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [res.locals.user.user_id]
    );

    if (result.rowCount === 0) {
      next(new CustomError("User not found", 404));
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Check token validity and return user info
 */
const checkToken = async (
  _req: Request,
  res: Response<{message: string, user: TokenContent}, {user: TokenContent}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      next(new CustomError("Invalid token", 401));
      return;
    }
    res.json({
      message: "Token valid",
      user: res.locals.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if email exists
 */
const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
      [req.params.email]
    );
    res.json({ available: !result.rows[0].exists });
  } catch (error) {
    next(error);
  }
};

/**
 * Check if username exists
 */
const checkUsernameExists = async (
  req: Request<{username: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
      [req.params.username]
    );
    res.json({ available: !result.rows[0].exists });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkToken,
  checkEmailExists,
  checkUsernameExists
};
