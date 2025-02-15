import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  LoginCredentials,
  RegisterUser,
  LoginResponse,
  UserResponse,
} from "../../types/userTypes";
import { getUserByUsername, createUser } from "../models/userModel";
import CustomError from "../../classes/CustomError";

/**
 * Login controller
 */
export const login = async (
  req: Request<{}, {}, LoginCredentials>,
  res: Response<LoginResponse>,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const user = await getUserByUsername(username);
    if (!user) {
      next(new CustomError("Invalid credentials", 401));
      return;
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      next(new CustomError("Invalid credentials", 401));
      return;
    }

    // Create token
    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register controller
 */
export const register = async (
  req: Request<{}, {}, RegisterUser>,
  res: Response<UserResponse>,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      next(new CustomError("Username already exists", 400));
      return;
    }

    // Create new user
    const newUser = await createUser({
      username,
      email,
      password,
    });

    if (!newUser) {
      next(new CustomError("User creation failed", 500));
      return;
    }

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};
