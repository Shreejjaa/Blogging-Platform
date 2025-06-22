import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import Spinner from '../components/Spinner';
import Meta from '../components/Meta';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const { isAuthenticated, user, token } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/blogs/${id}`);
                setBlog(res.data);
                setLikes(res.data.likes);
                setComments(res.data.comments);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blog details', err);
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        if (!isAuthenticated) return alert('Please log in to like posts.');
        try {
            const res = await axios.put(`http://127.0.0.1:5000/api/blogs/${id}/like`, {}, {
                headers: { 'x-auth-token': token }
            });
            setLikes(res.data);
        } catch (err) {
            console.error('Error liking post', err);
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return alert('Please log in to comment.');
        try {
            const res = await axios.post(`http://127.0.0.1:5000/api/blogs/${id}/comment`, { text: commentText }, {
                headers: { 'x-auth-token': token }
            });
            setComments(res.data);
            setCommentText('');
            toast.success('Comment added!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add comment.';
            console.error("Error adding comment:", err);
            toast.error(errorMessage);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://127.0.0.1:5000/api/blogs/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                navigate('/');
            } catch (err) {
                console.error('Error deleting post', err);
            }
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (!blog) {
        return <div className="text-center mt-10">Blog not found.</div>;
    }

    const createMarkup = (html) => {
        return { __html: DOMPurify.sanitize(html) };
    };
    
    const isLiked = user ? likes.includes(user._id) : false;
    const isAuthor = user ? user._id === blog.author._id : false;

    return (
        <>
            <Meta title={blog.title} description={blog.content.substring(0, 150)} keywords={blog.tags && blog.tags.join(', ')} />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <article>
                    {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-6" />}
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{blog.title}</h1>
                    <div className="text-sm text-gray-500 mb-4">
                        By {blog.author.name} on {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags && blog.tags.map(tag => (
                            <Link key={tag} to={`/blogs?tag=${tag}`} className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full hover:bg-gray-300">{tag}</Link>
                        ))}
                    </div>
                    <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={createMarkup(blog.content)} />
                    
                    <div className="mt-8 flex items-center justify-between">
                        <button onClick={handleLike} className={`px-4 py-2 rounded-md flex items-center gap-2 ${isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.787l.09.044a2 2 0 002.243-.442l4.262-5.52a2 2 0 00.353-1.574V5a2 2 0 00-2-2H9a2 2 0 00-2 2v5.333z" /></svg>
                            {likes.length} Likes
                        </button>
                        {isAuthor && (
                            <div className="flex gap-4">
                                <Link to={`/edit/${id}`} className="text-blue-500 hover:underline">Edit</Link>
                                <button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button>
                            </div>
                        )}
                    </div>
                </article>

                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
                    {isAuthenticated && (
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                                placeholder="Add a comment..."
                                required
                            ></textarea>
                            <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit</button>
                        </form>
                    )}
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold">{comment.user ? comment.user.name : "User"}</p>
                                <p className="text-gray-600 text-sm mb-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                <p>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetail;
