import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // This should come from your auth context in a real app
    const auth = JSON.parse(localStorage.getItem('auth')) || { isAuthenticated: false, user: null };

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!auth.user.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute; 