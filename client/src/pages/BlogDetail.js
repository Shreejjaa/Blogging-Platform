import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setBlog(res.data);
      const user = JSON.parse(localStorage.getItem('user'));
      if (res.data.likes?.includes(user.username)) {
        setLiked(true);
      }
      setLikesCount(res.data.likes?.length || 0);
    } catch (err) {
      console.error('Error fetching blog', err);
    }
  };

  useEffect(() => {
  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setBlog(res.data);
      const user = JSON.parse(localStorage.getItem('user'));
      if (res.data.likes?.includes(user.username)) {
        setLiked(true);
      }
      setLikesCount(res.data.likes?.length || 0);
    } catch (err) {
      console.error('Error fetching blog', err);
    }
  };
  
  fetchBlog();
}, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!comment.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/posts/${id}/comments`,
        { content: comment },
        { headers: { user: JSON.stringify(user) } }
      );
      setComment('');
      fetchBlog();
    } catch (err) {
      alert('Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${blog._id}`);
        alert('Blog deleted');
        window.location.href = '/blogs';
      } catch (err) {
        alert('Error deleting blog');
      }
    }
  };

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/posts/${blog._id}/like`,
        {},
        {
          headers: {
            user: JSON.stringify(user),
          },
        }
      );
      setLiked(!liked);
      setLikesCount(res.data.likes);
    } catch (err) {
      alert('Error liking blog');
    }
  };

  if (!blog) return <p>Loading...</p>;

  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="blog-detail-container">
      <h2>{blog.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {currentUser?.username === blog.author && (
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => window.location.href = `/edit/${blog._id}`}
            style={{ marginRight: '10px' }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: 'crimson', color: 'white' }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* ❤️ Like Button */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={handleLike}
          style={{
            backgroundColor: liked ? 'crimson' : 'gray',
            color: 'white',
            marginTop: '10px',
          }}
        >
          {liked ? '❤️ Unlike' : '🤍 Like'} ({likesCount})
        </button>
      </div>

      <hr />
      <h3>💬 Comments</h3>

      {blog.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        blog.comments.map((c, index) => (
          <div key={index} className="comment-card">
            <strong>{c.author}</strong>
            <p>{c.content}</p>
            <small>{new Date(c.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default BlogDetail;
