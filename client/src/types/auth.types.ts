export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}
