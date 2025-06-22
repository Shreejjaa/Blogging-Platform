import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState(null);
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('dashboard'); // 'dashboard', 'users', 'blogs'

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };

            if (view === 'dashboard') {
                const [statsRes, activityRes] = await Promise.all([
                    axios.get('http://127.0.0.1:5000/api/analytics/stats', config),
                    axios.get('http://127.0.0.1:5000/api/analytics/recent-activity', config)
                ]);
                setStats(statsRes.data);
                setActivity(activityRes.data);
            } else if (view === 'users') {
                const usersRes = await axios.get('http://127.0.0.1:5000/api/admin/users', config);
                setUsers(usersRes.data);
            } else if (view === 'blogs') {
                const blogsRes = await axios.get('http://127.0.0.1:5000/api/admin/blogs', config);
                setBlogs(blogsRes.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch admin data.');
        } finally {
            setLoading(false);
        }
    }, [view]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://127.0.0.1:5000/api/admin/users/${userId}`, { headers: { 'x-auth-token': token } });
                toast.success('User deleted successfully.');
                fetchData(); // Refresh data
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://127.0.0.1:5000/api/admin/blogs/${blogId}`, { headers: { 'x-auth-token': token } });
                toast.success('Blog post deleted successfully.');
                fetchData(); // Refresh data
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete blog.');
            }
        }
    };

    if (loading) return <Spinner />;

    const renderDashboard = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold">Total Users</h3>
                    <p className="text-4xl">{stats?.totalUsers}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold">Total Posts</h3>
                    <p className="text-4xl">{stats?.totalPosts}</p>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold">Total Comments</h3>
                    <p className="text-4xl">{stats?.totalComments}</p>
                </div>
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold">Total Likes</h3>
                    <p className="text-4xl">{stats?.totalLikes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Recent Users</h3>
                    <ul>
                        {activity?.recentUsers.map(user => (
                            <li key={user._id} className="border-b dark:border-gray-700 py-2 flex justify-between items-center">
                                <span>{user.username} ({user.email})</span>
                                <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
                    <ul>
                        {activity?.recentPosts.map(post => (
                            <li key={post._id} className="border-b dark:border-gray-700 py-2 flex justify-between items-center">
                                <span>{post.title}</span>
                                <span className="text-sm text-gray-500">by {post.author.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );

    const renderUserManagement = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Manage Users</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Username</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Joined</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="py-2 px-4 border-b">{user.username}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderBlogManagement = () => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Manage Blog Posts</h3>
             <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Title</th>
                            <th className="py-2 px-4 border-b">Author</th>
                            <th className="py-2 px-4 border-b">Created</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog._id}>
                                <td className="py-2 px-4 border-b">{blog.title}</td>
                                <td className="py-2 px-4 border-b">{blog.author?.username || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-white">
            <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
            
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-md ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Dashboard</button>
                <button onClick={() => setView('users')} className={`px-4 py-2 rounded-md ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Manage Users</button>
                <button onClick={() => setView('blogs')} className={`px-4 py-2 rounded-md ${view === 'blogs' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Manage Posts</button>
            </div>
            
            {view === 'dashboard' && renderDashboard()}
            {view === 'users' && renderUserManagement()}
            {view === 'blogs' && renderBlogManagement()}
        </div>
    );
};

export default AdminDashboard;
