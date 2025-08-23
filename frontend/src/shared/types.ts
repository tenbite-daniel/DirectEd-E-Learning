export type Role = "student" | "instructor";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
    token?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest extends LoginRequest {
    name: string;
    role: Role;
    confirmPassword: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
