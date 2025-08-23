import React, { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import { type User } from "../shared/types";
import { setAuthToken } from "../api/axiosInstance";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const savedUser = localStorage.getItem("authUser");
        const savedToken = localStorage.getItem("authToken");

        if (savedUser && savedToken) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setToken(savedToken);
            setAuthToken(savedToken);
        }
        setLoading(false); // finished loading
    }, []);
    // Load user/token from localStorage when app starts
    useEffect(() => {
        const savedUser = localStorage.getItem("authUser");
        const savedToken = localStorage.getItem("authToken");

        if (savedUser && savedToken) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setToken(savedToken);
            setAuthToken(savedToken); // set axios default
        }
    }, []);

    const login: AuthContextType["login"] = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        setAuthToken(token); // configure axios with Bearer token
    };

    const logout: AuthContextType["logout"] = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
