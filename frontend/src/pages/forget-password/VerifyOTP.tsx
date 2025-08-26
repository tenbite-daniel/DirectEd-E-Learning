import React, { useState, useRef } from "react";
import { authApi } from "../../api/authApi";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { email: string };
    const email = state?.email;

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // loading state
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = async (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return; // only allow numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input automatically
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Automatically verify when last digit is entered
        if (index === 5 && value) {
            await handleVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpValue?: string) => {
        if (!email) return setError("Email not found");
        const finalOtp = otpValue || otp.join("");
        if (finalOtp.length !== 6) return setError("Please enter the full OTP");

        try {
            setLoading(true);
            setError("");
            await authApi.verifyOtp({ email, otp: finalOtp });
            navigate("/reset-password-otp", {
                state: { email, otp: finalOtp },
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#395241] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Verify OTP
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to your email
                </p>
                <div className="flex justify-between space-x-2 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) =>
                                handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-12 text-center text-xl border-2 border-gray-400 rounded-lg focus:border-[#395241] focus:outline-none"
                        />
                    ))}
                </div>
                <button
                    onClick={() => handleVerify()}
                    disabled={loading}
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed text-gray-200"
                            : "bg-[#395241] text-white hover:bg-[#2e4034]"
                    }`}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
                {error && (
                    <p className="text-red-500 text-center mt-4 font-medium">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyOTP;
