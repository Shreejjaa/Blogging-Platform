import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogList.css';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const categoriesList = [
  "Fashion", "Beauty", "Travel", "Lifestyle", "Personal", "Tech", "Health",
  "Fitness", "Wellness", "SaaS", "Business", "Education", "Food and Recipe",
  "Love and Relationships", "Alternative topics", "Green living", "Music",
  "Automotive", "Marketing", "Internet services", "Finance", "Sports",
  "Entertainment", "Productivity", "Hobbies", "Parenting", "Pets",
  "Photography", "Agriculture", "Art", "DIY", "Science", "Gaming",
  "History", "Self-improvement", "News and current affairs"
];

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(queryParams.get('tag') || '');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // The location.search already contains the query params for filtering on the backend
        const { data } = await axios.get(`http://127.0.0.1:5000/api/blogs${location.search}`);
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [location.search]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    if (categoryFilter) {
      params.append('tag', categoryFilter);
    }
    navigate(`/blogs?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">All Blog Posts</h1>
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by title or content"
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>
        {loading ? (
          <Spinner />
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <svg className="mx-auto mb-4 w-16 h-16 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No blogs found.</p>
            <p className="text-sm text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map(blog => (
              <div key={blog._id} className="p-4 bg-gray-50 rounded shadow hover:shadow-md transition">
                <Link to={`/blogs/${blog._id}`} className="text-blue-600 hover:underline">
                  <h2 className="text-xl font-semibold text-blue-700">{blog.title}</h2>
                </Link>
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 150) + '...' }} />
                <div className="text-sm text-gray-400 mt-2">By {blog.author?.name || 'Unknown'} | {blog.tags && blog.tags.length > 0 ? blog.tags.join(', ') : 'No Tags'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
