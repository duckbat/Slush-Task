export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
  }
  
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
    email: string;
  }