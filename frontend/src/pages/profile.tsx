// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3500/api/profile",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const userData = res.data as IUser;
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
            } catch (err: any) {
                setError(
                    err.response?.data?.message || "Failed to fetch profile"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const updateProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.put(
                "http://localhost:3500/api/profile",
                { name, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = res.data as { user: IUser; message: string };
            setUser(data.user);
            setSuccessMsg(data.message);
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update profile");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:3500/api/change-password",
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMsg((res.data as { message: string }).message);
            setOldPassword("");
            setNewPassword("");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to change password"
            );
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error)
        return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            {/* Outer amber background */}
            <div className="bg-amber-200 rounded-md shadow-md pt-12">
                {/* Inner white card */}
                <div className="bg-white shadow-md pt-12 px-6 pb-6 relative">
                    <h1 className="text-3xl font-bold mb-6">{`Welcome Back, ${user?.name}!`}</h1>
                    <p className="mb-6 text-gray-700">
                        Continue your learning journey and track your progress.
                    </p>

                    {successMsg && (
                        <div className="text-green-600 mb-4 text-center">
                            {successMsg}
                        </div>
                    )}

                    {/* Editable Profile Info */}
                    <div className="flex items-center space-x-4">
                        {/* User Icon */}
                        <User className="w-12 h-12 text-gray-700" />

                        {/* User Info */}
                        <div className="flex flex-col">
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Name:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Role:
                        </label>
                        <p className="text-gray-700 capitalize">{user?.role}</p>
                    </div>

                    <button
                        onClick={updateProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8"
                    >
                        Save Profile
                    </button>

                    {/* Change Password Section */}
                    <h2 className="text-2xl font-bold mt-6 mb-4">
                        Change Password
                    </h2>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            Old Password:
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-1">
                            New Password:
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <button
                        onClick={changePassword}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
