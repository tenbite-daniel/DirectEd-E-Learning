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
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await authApi.login(form);
            const data: AuthResponse = res.data;

            // Save user + token
            localStorage.setItem("authUser", JSON.stringify(data));
            login(data.user, data.token);

            // Redirect directly based on role
            if (data.user.role === "student") {
                navigate("/student-dashboard");
            } else if (data.user.role === "instructor") {
                navigate("/instructor-dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message ?? "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#395241] px-4">
            <section className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl p-6 sm:p-8 md:p-10">
                {/* Header */}
                <div className="w-full text-center mb-8">
                    <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-white text-sm sm:text-base">
                        Sign in to continue with your journey
                    </p>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg outline-none bg-gray-100 focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-100 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg outline-none bg-gray-100 focus:ring-2 focus:ring-orange-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
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
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
                            className="text-sm text-gray-200 hover:text-gray-300"
                        >
                            Forgot Your Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-200"
                    >
                        Log In
                    </button>
                </form>

                <hr className="mt-6" />

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-200 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/onboarding"
                        className="text-orange-500 hover:text-orange-600 underline font-medium"
                    >
                        Sign Up Here
                    </Link>
                </p>

                {/* Error Messages */}
                {error && (
                    <div className="mt-6 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}
            </section>
        </div>
    );
};
