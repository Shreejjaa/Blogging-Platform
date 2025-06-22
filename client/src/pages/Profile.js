import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Profile = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                // Fetch user profile details
                const profileRes = await axios.get(`http://127.0.0.1:5000/api/auth/user/${user._id}`);
                setProfile(profileRes.data);

                // Fetch user's blogs
                const blogsRes = await axios.get(`http://127.0.0.1:5000/api/blogs/user/${user._id}`);
                setBlogs(blogsRes.data);

            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <Spinner />;
    }

    if (!profile) {
        return <div className="text-center mt-10">Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center">
                <div className="md:ml-6 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{profile.bio || 'No bio available.'}</p>
                    <div className="mt-4">
                        <Link to="/edit-profile" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 mr-2">
                            Edit Profile
                        </Link>
                        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-40 object-cover"/>}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex justify-between items-center">
                                    <Link to={`/blogs/${blog._id}`} className="text-blue-600 hover:underline">
                                        Read More
                                    </Link>
                                    <Link to={`/edit/${blog._id}`} className="text-green-600 hover:underline">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">You haven't posted any blogs yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
