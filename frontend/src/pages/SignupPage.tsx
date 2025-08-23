import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { authApi } from "../api/authApi";
import { type SignupRequest, type AuthResponse } from "../shared/types";
import { useAuth } from "../hooks/useAuth";

export const Signup: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState<SignupRequest>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student", // default fallback
    });
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Set role from onboarding page if available
    useEffect(() => {
        const state = location.state as { role: "student" | "instructor" };
        if (state?.role) {
            setForm((prev) => ({ ...prev, role: state.role }));
        }
    }, [location.state]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await authApi.signup(form);
            const data: AuthResponse = res.data;

            localStorage.setItem("authUser", JSON.stringify(data));
            login(data.user, data.token);
            setShowSuccessModal(true);
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message ?? "Signup failed");
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

    // Back button handler to go to onboarding step 5
    const handleBackToOnboarding = () => {
        navigate("/onboarding", { state: { role: form.role, step: 4 } });
    };

    return (
        <div className="min-h-screen bg-[#395241] flex flex-col items-center justify-center px-4 relative">
            {!showSuccessModal && (
                <button
                    onClick={handleBackToOnboarding}
                    className="absolute top-4 left-3 text-white px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800"
                >
                    ← Back
                </button>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
                    <div className="text-center mb-8">
                        <h1 className="text-white text-2xl font-semibold mb-2">
                            Join DirectEd
                        </h1>
                        <p className="text-gray-400">
                            Sign up to join our community
                        </p>
                    </div>

                    <div className="w-full max-w-md bg-yellow-50 rounded-lg p-12 shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-orange-500 mb-8">
                            Signed up successfully!!
                        </h2>

                        <button
                            onClick={handleContinueToApp}
                            className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors duration-200"
                        >
                            Continue to App
                        </button>
                    </div>
                </div>
            )}

            {!showSuccessModal && (
                <>
                    <div className="text-center my-8">
                        <h1 className="text-white text-2xl font-bold mb-2">
                            Join DirectEd
                        </h1>
                        <p className="text-gray-100 font-semibold">
                            Create Your Account To Begin
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#F3EEE2] text-black py-3 rounded-3xl font-semibold hover:bg-[#d6d2ca] transition-colors duration-200 mt-6"
                            >
                                Sign up
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-300 mt-4">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-gray-300 hover:text-gray-400 underline font-medium"
                            >
                                Sign in
                            </button>
                        </p>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
