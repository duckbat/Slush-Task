import pool from "../../utils/db";
import { User } from "../../types/dbTypes";
import { UserWithNoPassword } from "../../types/userTypes";
import bcrypt from "bcrypt";

/**
 * Get user by id
 */
export const getUserById = async (
  id: number
): Promise<UserWithNoPassword | null> => {
  try {
    const result = await pool.query<User>(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("getUserById error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<UserWithNoPassword[] | null> => {
  try {
    const result = await pool.query<User>(
      "SELECT id, username, email, created_at FROM users"
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (e) {
    console.error("getAllUsers error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("getUserByEmail error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("getUserByUsername error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Create new user
 */
export const createUser = async (
  user: Omit<User, "id" | "created_at">
): Promise<UserWithNoPassword | null> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await pool.query<User>(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [user.username, user.email, hashedPassword]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("createUser error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update user
 */
export const updateUser = async (
  id: number,
  user: Partial<User>
): Promise<UserWithNoPassword | null> => {
  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const result = await pool.query<User>(
      "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING id, username, email, created_at",
      [user.username, user.email, user.password, id]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error("updateUser error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (e) {
    console.error("deleteUser error:", (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export const checkPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
