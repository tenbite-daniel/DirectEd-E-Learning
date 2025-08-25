import React, { useState } from "react";
import { AxiosError } from "axios";
import { authApi } from "../api/authApi";
import { type ChangePasswordRequest } from "../shared/types";

export const ChangePassword: React.FC = () => {
    const [form, setForm] = useState<ChangePasswordRequest>({
        oldPassword: "",
        newPassword: "",
    });
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem("token"); // ✅ token for auth

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) {
            setMessage("You must be logged in to change your password.");
            setIsSuccess(false);
            return;
        }

        setMessage(null);
        setIsSuccess(false);
        setLoading(true);

        try {
            // ✅ Send token with request
            await authApi.changePassword(form, token);

            setMessage("Password updated successfully!");
            setIsSuccess(true);
            setForm({ oldPassword: "", newPassword: "" });
        } catch (err) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setMessage(
                axiosError.response?.data?.message ?? "Error updating password"
            );
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="oldPassword"
                        type="password"
                        placeholder="Old Password"
                        value={form.oldPassword}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-md p-3 font-semibold text-white transition duration-200 ease-in-out ${
                            loading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`mt-4 text-center ${
                            isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};
