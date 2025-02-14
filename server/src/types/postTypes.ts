export interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface TokenContent {
    user_id: number;
    username: string;
  }
  
  export interface PostResponse {
    message: string;
    post: Post;
  }
  
  export interface MessageResponse {
    message: string;
  }