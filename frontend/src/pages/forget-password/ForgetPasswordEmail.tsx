import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await authApi.requestOtp({ email });
            setMessage("OTP sent to your email!");
            navigate("/verify-otp", { state: { email } });
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#395241] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Forgot Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#395241] focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#395241] text-white py-2 rounded-lg font-semibold hover:bg-[#2e4034] transition disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
                {message && (
                    <p className="text-green-600 text-center mt-4 font-medium">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="text-red-500 text-center mt-4 font-medium">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;
