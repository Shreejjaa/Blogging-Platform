const express = require('express');
const router = express.Router();
const admin = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Blog = require('../models/Blog');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        // Optional: also delete user's posts and comments
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/blogs
// @desc    Get all blogs for admin view
// @access  Private/Admin
router.get('/blogs', admin, async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', ['name']).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE /api/admin/blogs/:id
// @desc    Delete a blog post by admin
// @access  Private/Admin
router.delete('/blogs/:id', admin, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });

        await blog.remove();
        res.json({ msg: 'Blog removed by admin' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
