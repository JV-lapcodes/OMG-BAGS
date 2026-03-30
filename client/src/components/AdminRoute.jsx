import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Fallback cleanly preventing non-admin accounts from loading UI views and APIs
    if (!user || user.isAdmin !== 1) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
