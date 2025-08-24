import axiosInstance from "./axiosInstance";

export const authApi = {
    
    signup: (data: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) => axiosInstance.post("/auth/signup", data),

    login: (data: { email: string; password: string }) =>
        axiosInstance.post("/auth/login", data),

    profile: () => axiosInstance.get("/auth/profile"),

    // ✅ New method for logged-in users
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
        axiosInstance.put("/auth/reset-password", data),
    // 🔹 Forget Password flow
    requestOtp: (data: { email: string }) =>
        axiosInstance.post("/auth/forgot-password", data),

    verifyOtp: (data: { email: string; otp: string }) =>
        axiosInstance.post("/auth/verify-otp", data),

    resetPasswordWithOtp: (data: {
        email: string;
        otp: string;
        newPassword: string;
    }) => axiosInstance.post("/auth/reset-password-otp", data),
};
