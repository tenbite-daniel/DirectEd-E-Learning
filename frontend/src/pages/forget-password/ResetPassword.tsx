import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Tailwind-friendly icons

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { email: string; otp: string };
    const email = state?.email;
    const otp = state?.otp;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReset = async () => {
        if (!email || !otp) return setError("Invalid request");
        if (newPassword !== confirmPassword)
            return setError("Passwords do not match");

        try {
            await authApi.resetPasswordWithOtp({ email, otp, newPassword });
            setError("");
            setSuccess("Password reset successful. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#395241] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Reset Password
                </h2>
                <form className="space-y-5">
                    {/* New Password */}
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-[#395241]"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-[#395241]"
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-[#395241] text-white py-2 rounded-lg font-semibold hover:bg-[#2e4034] transition"
                    >
                        Change Password
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-center mt-4 font-medium">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-center mt-4 font-medium">
                        {success}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
