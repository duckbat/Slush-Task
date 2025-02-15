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

/**
 * @api {get} /posts Get All Posts
 * @apiName GetAllPosts
 * @apiGroup Post
 *
 * @apiSuccess {Object[]} posts List of posts
 * @apiSuccess {Number} posts.id Post's unique ID
 * @apiSuccess {String} posts.title Post title
 * @apiSuccess {String} posts.content Post content
 * @apiSuccess {Number} posts.user_id Creator's user ID
 * @apiSuccess {Date} posts.created_at Creation timestamp
 * @apiSuccess {Date} posts.updated_at Last update timestamp
 */
router.get("/", getAllPosts);

/**
 * @api {get} /posts/:id Get Post by ID
 * @apiName GetPostById
 * @apiGroup Post
 *
 * @apiParam {Number} id Post's unique ID
 *
 * @apiSuccess {Object} post Post information
 * @apiSuccess {Number} post.id Post's unique ID
 * @apiSuccess {String} post.title Post title
 * @apiSuccess {String} post.content Post content
 * @apiSuccess {Number} post.user_id Creator's user ID
 * @apiSuccess {Date} post.created_at Creation timestamp
 * @apiSuccess {Date} post.updated_at Last update timestamp
 */
router.get("/:id", param("id").isNumeric(), getPostById);

/**
 * @api {post} /posts Create Post
 * @apiName CreatePost
 * @apiGroup Post
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token)
 *
 * @apiParam (Request body) {String} title Post title
 * @apiParam (Request body) {String} content Post content
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} post Created post information
 */
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

/**
 * @api {put} /posts/:id Update Post
 * @apiName UpdatePost
 * @apiGroup Post
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token)
 *
 * @apiParam {Number} id Post's unique ID
 * @apiParam (Request body) {String} [title] Post title
 * @apiParam (Request body) {String} [content] Post content
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} post Updated post information
 */
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

/**
 * @api {delete} /posts/:id Delete Post
 * @apiName DeletePost
 * @apiGroup Post
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token)
 *
 * @apiParam {Number} id Post's unique ID
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} post Deleted post ID
 */
router.delete("/:id", authenticate, param("id").isNumeric(), deletePost);

export default router;
