import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    role?: "student" | "instructor";
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
