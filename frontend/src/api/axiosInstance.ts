// src/services/axiosInstance.ts
import axios from "axios";

// Base URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// Create Axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Function to set JWT Authorization header manually
export const setAuthToken = (token: string | null) => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
};

// Attach JWT token automatically from localStorage
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 Unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authUser");
            window.location.href = "/login"; // redirect
        }
        return Promise.reject(error);
    }
);

export default api;
