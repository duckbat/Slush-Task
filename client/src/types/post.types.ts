export interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    username: string;
    created_at: string;
    updated_at: string;
  }

export interface PostForm {
    title: string;
    content: string;
  }
  