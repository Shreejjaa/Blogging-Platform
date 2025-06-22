import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Spinner from '../components/Spinner';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Set token for future requests
            axios.defaults.headers.common['x-auth-token'] = token;
            
            // Fetch the user data with the new token
            axios.get('http://localhost:5000/api/auth')
                .then(res => {
                    const user = res.data;
                    // Use the login function from context to set the state
                    login(user, token);
                    navigate('/');
                })
                .catch(err => {
                    console.error('Failed to fetch user after Google auth', err);
                    navigate('/login');
                });
        } else {
            // No token found, redirect to login
            navigate('/login');
        }
    }, [location, navigate, login]);

    return <Spinner />;
};

export default AuthCallback; 