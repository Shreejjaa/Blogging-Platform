import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">📝 BlogApp</div>
      <ul className="nav-links">
        <li><Link to="/blogs">Blogs</Link></li>
        {token && <li><Link to="/create">Create</Link></li>}
        {!token && <li><Link to="/register">Register</Link></li>}
        {!token && <li><Link to="/login">Login</Link></li>}

        {token && (
          <>
            <li className="username">👤 {user?.username}</li>
            <li><Link to="/profile">Profile</Link></li>

            {/* ✅ Admin link only for admin users */}
            {user?.isAdmin && (
              <li><Link to="/admin">Admin</Link></li>
            )}

            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </>
        )}

        <li>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
