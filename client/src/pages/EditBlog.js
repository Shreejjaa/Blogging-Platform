import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill's snow theme CSS
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';

const categoriesList = [
  "Fashion", "Beauty", "Travel", "Lifestyle", "Personal", "Tech", "Health",
  "Fitness", "Wellness", "SaaS", "Business", "Education", "Food and Recipe",
  "Love and Relationships", "Alternative topics", "Green living", "Music",
  "Automotive", "Marketing", "Internet services", "Finance", "Sports",
  "Entertainment", "Productivity", "Hobbies", "Parenting", "Pets",
  "Photography", "Agriculture", "Art", "DIY", "Science", "Gaming",
  "History", "Self-improvement", "News and current affairs"
];

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [status, setStatus] = useState('published'); // or 'draft'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:5000/api/blogs/${id}`);
                // Authorization check
                if (user && user._id !== data.author._id) {
                    toast.error("You are not authorized to edit this post.");
                    navigate(`/blogs/${id}`);
                    return;
                }
                setTitle(data.title);
                setContent(data.content);
                setTags(data.tags || []);
                setStatus(data.status);
            } catch (error) {
                console.error("Error fetching blog post:", error);
                toast.error("Failed to load blog post.");
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, user, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const sanitizedContent = DOMPurify.sanitize(content);

        const updatedBlog = {
            title,
            content: sanitizedContent,
            tags: tags,
            status,
        };

        try {
            await axios.put(`http://127.0.0.1:5000/api/blogs/${id}`, updatedBlog, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            toast.success("Blog post updated successfully!");
            navigate(`/blogs/${id}`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update blog post.";
            console.error("Error updating blog post:", error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setTags(prevTags =>
            prevTags.includes(category)
                ? prevTags.filter(tag => tag !== category)
                : [...prevTags, category]
        );
    };

    const quillModules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Edit Blog Post</h1>
            <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={quillModules}
                        className="bg-white dark:bg-gray-700 dark:text-white rounded-md"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoriesList.map(category => (
                            <div key={category} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={category}
                                    checked={tags.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor={category} className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-8">
                    <label htmlFor="status" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;
