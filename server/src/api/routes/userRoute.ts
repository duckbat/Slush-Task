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

/**
 * @api {get} /users Get User List
 * @apiName GetUserList
 * @apiGroup User
 *
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.id User's unique ID.
 * @apiSuccess {String} users.username User's username.
 * @apiSuccess {String} users.email User's email.
 * @apiSuccess {Date} users.created_at Timestamp
 */
router.get("/", getAllUsers);

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam (Request body) {String} username Username
 * @apiParam (Request body) {String} password Password
 * @apiParam (Request body) {String} email Email
 */
router.post(
  "/",
  body("username").notEmpty().isString().escape().trim().isLength({ min: 3 }),
  body("password").notEmpty().isString().escape().trim().isLength({ min: 5 }),
  body("email").isEmail(),
  createUser
);

/**
 * @api {put} /users Update User
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission Bearer Token
 */
router.put(
  "/",
  authenticate,
  body("username").optional().isString().escape().trim().isLength({ min: 3 }),
  body("password").optional().isString().escape().trim().isLength({ min: 5 }),
  body("email").optional().isEmail(),
  updateUser
);

/**
 * @api {delete} /users Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission Bearer Token
 */
router.delete("/", authenticate, deleteUser);

/**
 * @api {get} /users/token Check Token
 * @apiName CheckToken
 * @apiGroup User
 * @apiPermission Bearer Token
 */
router.get("/token", authenticate, checkToken);

/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup User
 */
router.get("/:id", param("id").isNumeric(), getUserById);

/**
 * @api {get} /users/email/:email Check Email
 * @apiName CheckEmail
 * @apiGroup User
 */
router.get("/email/:email", param("email").isEmail(), checkEmailExists);

/**
 * @api {get} /users/username/:username Check Username
 * @apiName CheckUsername
 * @apiGroup User
 */
router.get(
  "/username/:username",
  param("username").isString().escape(),
  checkUsernameExists
);

export default router;
