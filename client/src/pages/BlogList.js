import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setBlogs(res.data);

        // Get all unique categories from blogs
        const categoriesSet = new Set();
        res.data.forEach(blog => {
          blog.categories.forEach(cat => categoriesSet.add(cat));
        });
        setAllCategories([...categoriesSet]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by search and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? blog.categories.includes(categoryFilter)
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-list-container">
      <h2>All Blog Posts</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or content"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="blogs">
        {filteredBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          filteredBlogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <Link to={`/blogs/${blog._id}`}>
                <h3>{blog.title}</h3>
              </Link>
              <p>By: {blog.author}</p>
              <div dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 100) + '...' }} />
              <p><strong>Categories:</strong> {blog.categories.join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;
