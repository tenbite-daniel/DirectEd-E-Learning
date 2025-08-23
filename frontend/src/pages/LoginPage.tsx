import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { authApi } from "../api/authApi";
import { type LoginRequest, type AuthResponse } from "../shared/types";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            // Use authApi.login instead of api.post
            const res = await authApi.login(form);
            const data: AuthResponse = res.data;

            // Save user + token in localStorage and context
            localStorage.setItem("authUser", JSON.stringify(data));
            login(data.user, data.token);

            setShowSuccessModal(true);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message ?? "Login failed");
        }
    };

    const { user } = useAuth();
    const handleContinueToApp = () => {
        if (!user) return;

        if (user.role === "student") {
            navigate("/student-dashboard");
        } else if (user.role === "instructor") {
            navigate("/instructor-dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#395241]">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="w-full fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-white text-2xl font-semibold mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to continue with your journey
                        </p>
                    </div>

                    {/* Success Card */}
                    <div className="w-full max-w-lg bg-yellow-50 rounded-lg p-12 shadow-lg text-center">
                        {/* Logo */}

                        {/* Success Message */}
                        <h2 className="text-2xl font-bold text-orange-500 mb-8">
                            Signed in successfully!!
                        </h2>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinueToApp}
                            className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors duration-200"
                        >
                            Continue to App
                        </button>
                    </div>
                </div>
            )}

            {/* Regular Login Form - Hidden when success modal is shown */}
            {!showSuccessModal && (
                <section>
                    {/* Header */}
                    <div className="w-full text-center mb-8 bg-[#395241]">
                        <h1 className="text-white text-2xl font-semibold mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to continue with your journey
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="w-full py-3">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 w-full"
                        >
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-3">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-none rounded-lg outline-none bg-[#F3EEE2]"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-100 mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-none rounded-lg outline-none bg-[#F3EEE2]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-gray-200 hover:text-orange-500"
                                >
                                    Forgot Your Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#F3EEE2] text-black py-3 rounded-3xl font-semibold hover:bg-[#eae5d9] transition-colors duration-200 mt-6"
                            >
                                Log In
                            </button>
                        </form>
                        <hr className="mt-4" />
                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-200 mt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/onboarding"
                                className="text-gray-200 hover:text-gray-400 underline font-medium"
                            >
                                Sign Up Here
                            </Link>
                        </p>

                        {/* Error Messages */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};
