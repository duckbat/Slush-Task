import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controller/postController";
import { authenticate } from "../../middleware";
import { body, param } from "express-validator";

const router = express.Router();

router.get("/", getAllPosts);

router.get("/:id", param("id").isNumeric(), getPostById);

router.post(
  "/",
  authenticate,
  body("title")
    .notEmpty()
    .isString()
    .escape()
    .trim()
    .isLength({ min: 1, max: 255 }),
  body("content").notEmpty().isString().escape().trim(),
  createPost
);

router.put(
  "/:id",
  authenticate,
  param("id").isNumeric(),
  body("title")
    .optional()
    .isString()
    .escape()
    .trim()
    .isLength({ min: 1, max: 255 }),
  body("content").optional().isString().escape().trim(),
  updatePost
);

router.delete("/:id", authenticate, param("id").isNumeric(), deletePost);

export default router;
