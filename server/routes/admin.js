const express = require('express');
const User = require('../models/User');
const Blog = require('../models/Blog');
const router = express.Router();

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const user = JSON.parse(req.headers.user);
  if (user && user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// GET all users - Admin only
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// GET all posts - Admin only
router.get('/posts', verifyAdmin, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
});

// DELETE user by ID - Admin only
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// DELETE post by ID - Admin only
router.delete('/posts/:id', verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
});

module.exports = router;
