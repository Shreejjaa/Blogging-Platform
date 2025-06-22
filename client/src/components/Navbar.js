import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Search from './Search';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold">📝 BlogApp</Link>
        <Search />
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/blogs" className="hover:text-gray-300">Blogs</Link>
        {isAuthenticated ? (
          <>
            <Link to="/create" className="hover:text-gray-300">Create Post</Link>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            {user && user.isAdmin && (
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            )}
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        )}
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Dark Mode"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
