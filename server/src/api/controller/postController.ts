import { Request, Response, NextFunction } from "express";
import { TokenContent, PostResponse } from "../../types/postTypes";
import CustomError from "../../classes/CustomError";
import { Post } from "../../types/dbTypes";
import { MessageResponse } from "../../types/Messages";
import * as postModel from "../models/postModel";

/**
 * Get all posts controller
 */
const getAllPosts = async (
  req: Request,
  res: Response<Post[]>,
  next: NextFunction
) => {
  try {
    const posts = await postModel.fetchAllPosts();
    if (!posts) {
      next(new CustomError("No posts found", 404));
      return;
    }
    res.json(posts);
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
    const post = await postModel.fetchPostById(id);
    if (!post) {
      next(new CustomError("Post not found", 404));
      return;
    }
    res.json(post);
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
    if (!res.locals.user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    const postData = {
      ...req.body,
      user_id: res.locals.user.user_id,
    };

    const post = await postModel.createPost(postData);
    if (!post) {
      next(new CustomError("Post creation failed", 500));
      return;
    }

    res.status(201).json({
      message: "Post created successfully",
      post: post,
    });
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
    if (!res.locals.user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    const id = Number(req.params.id);
    const post = await postModel.updatePost(id, req.body, res.locals.user);

    if (!post) {
      next(new CustomError("Post update failed", 404));
      return;
    }
    res.json({ message: "Post updated successfully", post: post });
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
    if (!res.locals.user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    const id = Number(req.params.id);
    const result = await postModel.deletePost(id, res.locals.user);

    if (!result) {
      next(new CustomError("Post not found or unauthorized", 404));
      return;
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
