const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blog');
const admin = require('../middleware/adminMiddleware');

// @route   GET /api/analytics/stats
// @desc    Get key statistics for the admin dashboard
// @access  Private/Admin
router.get('/stats', admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Blog.countDocuments();
        
        // Aggregate to count total comments and likes across all blogs
        const blogStats = await Blog.aggregate([
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: { $size: "$comments" } },
                    totalLikes: { $sum: { $size: "$likes" } }
                }
            }
        ]);

        const stats = {
            totalUsers,
            totalPosts,
            totalComments: blogStats.length > 0 ? blogStats[0].totalComments : 0,
            totalLikes: blogStats.length > 0 ? blogStats[0].totalLikes : 0,
        };

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analytics/recent-activity
// @desc    Get recent users and posts for the admin dashboard
// @access  Private/Admin
router.get('/recent-activity', admin, async (req, res) => {
    try {
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
        const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(5).populate('author', 'username');

        res.json({ recentUsers, recentPosts });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
