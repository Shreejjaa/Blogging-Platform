import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // This effect runs once on app load to check for an existing session
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            axios.defaults.headers.common['x-auth-token'] = tokenFromStorage;
            axios.get('http://127.0.0.1:5000/api/auth')
                .then(res => {
                    setUser(res.data);
                    setIsAuthenticated(true);
                    setToken(tokenFromStorage);
                })
                .catch(() => {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false); // No token, not loading
        }
    }, []); // Empty dependency array means this runs only once on mount

    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        axios.defaults.headers.common['x-auth-token'] = userToken;
        
        // The user object from login/register has `id`, but from auth validation has `_id`
        const userWithId = { ...userData, _id: userData.id || userData._id };
        
        setUser(userWithId);
        setIsAuthenticated(true);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 