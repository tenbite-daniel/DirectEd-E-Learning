import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { email: string };
    const email = state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleVerify = async () => {
        if (!email) return setError("Email not found");
        try {
            await authApi.verifyOtp({ email, otp });
            setError("");
            navigate("/reset-password", { state: { email, otp } });
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div>
            <input
                type="text"
                maxLength={6}
                value={otp}
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerify}>Verify OTP</button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default VerifyOTP;
