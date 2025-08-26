import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
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
                `${import.meta.env.VITE_API_URL}/api/profile`,
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

    if (loading)
        return (
            <div className="text-center mt-10 text-gray-700 dark:text-gray-200">
                Loading...
            </div>
        );
    if (error)
        return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center pt-28 px-4">
            <div className="w-full max-w-2xl">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-[#395241] h-32 relative">
                        <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <User className="w-12 h-12 text-[#395241]" />
                        </div>
                    </div>

                    <div className="pt-16 px-8 pb-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{`Hello, ${user?.name}`}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Update your profile information below.
                        </p>

                        {successMsg && (
                            <div className="text-green-600 mb-4 text-center font-medium">
                                {successMsg}
                            </div>
                        )}

                        {/* Profile Form */}
                        <div className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#395241] dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#395241] dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                                    Role
                                </label>
                                <p className="text-gray-700 dark:text-gray-300 capitalize">
                                    {user?.role}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={updateProfile}
                                    className="flex-1 bg-[#395241] text-white py-2 rounded-lg font-semibold hover:bg-[#2e4034] transition"
                                >
                                    Save Profile
                                </button>

                                <button
                                    onClick={() => navigate("/reset-password")}
                                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
