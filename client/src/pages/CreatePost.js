import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    const categoriesArray = categories
      .split(',')
      .map((cat) => cat.trim())
      .filter((cat) => cat !== '');

    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { title, content, categories: categoriesArray },
        { headers: { user: JSON.stringify(user) } }
      );
      alert('Blog post created!');
      setTitle('');
      setContent('');
      setCategories('');
    } catch (err) {
      console.error('Create post error:', err.response || err);
      alert('Error creating blog post: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Write your blog content here..."
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
