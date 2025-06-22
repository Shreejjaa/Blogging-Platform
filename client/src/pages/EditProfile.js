import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const EditProfile = () => {
    const { user, token, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        bio: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                bio: user.bio || ''
            });
            setLoading(false);
        } else {
           // If no user, redirect away
           navigate('/login');
        }
    }, [user, navigate]);

    const { username, bio } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put('http://127.0.0.1:5000/api/auth/profile', formData, {
                headers: { 'x-auth-token': token }
            });

            // Update user in context after successful update
            const updatedUser = { ...user, ...res.data };
            login(updatedUser, token);

            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile.';
            console.error("Error updating profile:", err);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Edit Your Profile</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label htmlFor="bio" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        id="bio"
                        rows="4"
                        value={bio}
                        onChange={onChange}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Tell us a little about yourself"
                    />
                </div>
                <div className="flex items-center justify-end gap-4">
                     <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
