import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        const filtered = res.data.filter(
          (blog) => blog.author && blog.author === user.username // ✅ safe filter
        );
        setMyBlogs(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyBlogs();
  }, [user]);

  return (
    <div className="profile-container">
      <h2>👤 Profile</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <h3>📝 My Blogs</h3>
      {myBlogs.length === 0 ? (
        <p>You haven't posted anything yet.</p>
      ) : (
        myBlogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <h4>{blog.title}</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content.slice(0, 80) + '...'
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
