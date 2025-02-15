import { User } from './dbTypes';
import { MessageResponse } from './Messages';

export type UserWithNoPassword = Omit<User, 'password'>;

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterUser extends LoginCredentials {
    email: string;
}

export interface LoginResponse extends MessageResponse {
    token: string;
    user: UserWithNoPassword;
}

export interface UserResponse extends MessageResponse {
    user: UserWithNoPassword;
}