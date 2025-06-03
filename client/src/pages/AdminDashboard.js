import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { user: JSON.stringify(user) }
        });
        const postsRes = await axios.get('http://localhost:5000/api/admin/posts', {
          headers: { user: JSON.stringify(user) }
        });
        setUsers(usersRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        alert('Access denied or error fetching admin data');
      }
    };
    fetchData();
  }, [user]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { user: JSON.stringify(user) }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
        headers: { user: JSON.stringify(user) }
      });
      setPosts(posts.filter(p => p._id !== id));
    } catch (error) {
      alert('Error deleting post');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Users</h3>
        <ul>
          {users.map(u => (
            <li key={u._id}>
              {u.username} ({u.email}) 
              <button onClick={() => deleteUser(u._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Posts</h3>
        <ul>
          {posts.map(p => (
            <li key={p._id}>
              {p.title} by {p.author} 
              <button onClick={() => deletePost(p._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
