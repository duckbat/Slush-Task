import { Post } from './dbTypes';
import { MessageResponse } from './Messages';

export interface TokenContent {
    user_id: number;
    username: string;
}

export type CreatePost = Pick<Post, 'title' | 'content'>;
export type UpdatePost = Partial<CreatePost>;

export interface PostResponse extends MessageResponse {
    post: Post;
}

export interface PostsResponse extends MessageResponse {
    posts: Post[];
}