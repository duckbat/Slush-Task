import express from 'express';
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from '../controller/postController';


const router = express.Router();

// Base routes
router
  .route('/')
  .get(getAllPosts)
  .post(createPost);

// Routes with ID parameter
router
  .route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

export default router;