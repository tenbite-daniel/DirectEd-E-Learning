// shared/types.ts
import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
    Student = "student",
    Instructor = "instructor",
}

export interface ISignupRequest {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: UserRole;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IResetPasswordRequest {
    email: string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface IAuthResponse {
    message: string;
    token: string;
    user: IUser;
}

export interface IResetPasswordResponse {
    message: string;
}

export interface IJwtPayload extends JwtPayload {
    id: string;
    role: UserRole;
}
export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
