import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authApi.requestOtp({ email });
            setMessage("OTP sent to your email!");
            setError("");
            navigate("/verify-otp", { state: { email } });
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send OTP</button>
            {message && <p>{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default ForgotPasswordEmail;
