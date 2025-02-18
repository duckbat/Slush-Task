import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
} from "../controller/userController";
import { authenticate } from "../../middleware";
import { body, param } from "express-validator";

const router = express.Router();

router.get("/", getAllUsers);

router.post(
  "/",
  body("username").notEmpty().isString().escape().trim().isLength({ min: 3 }),
  body("password").notEmpty().isString().escape().trim().isLength({ min: 5 }),
  body("email").isEmail(),
  createUser
);

router.put(
  "/",
  authenticate,
  body("username").optional().isString().escape().trim().isLength({ min: 3 }),
  body("password").optional().isString().escape().trim().isLength({ min: 5 }),
  body("email").optional().isEmail(),
  updateUser
);

router.delete("/", authenticate, deleteUser);

router.get("/token", authenticate, checkToken);

router.get("/:id", param("id").isNumeric(), getUserById);

router.get("/email/:email", param("email").isEmail(), checkEmailExists);

router.get(
  "/username/:username",
  param("username").isString().escape(),
  checkUsernameExists
);

export default router;
