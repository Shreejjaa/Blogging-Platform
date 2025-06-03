const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

// POST /api/posts - Create a new blog post with author info and categories
router.post('/', async (req, res) => {
  const { title, content, categories } = req.body; // added categories here
  const user = JSON.parse(req.headers.user); // Get user from headers

  try {
    const newBlog = new Blog({
      title,
      content,
      author: user.username,
      categories: categories || [] // Save categories or empty array
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving blog', error: err.message });
  }
});

// GET /api/posts - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
});

// GET /api/posts/:id - Get blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
});

// PUT /api/posts/:id - Update a blog post
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
});

// DELETE /api/posts/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
});

// POST /api/posts/:id/comments - Add a comment to a blog
router.post('/:id/comments', async (req, res) => {
  const { content } = req.body;
  const user = JSON.parse(req.headers.user);

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const newComment = {
      author: user.username,
      content,
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
});

// PATCH /api/posts/:id/like - Toggle like/unlike
router.patch('/:id/like', async (req, res) => {
  const user = JSON.parse(req.headers.user);
  const username = user.username;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.likes.includes(username)) {
      blog.likes = blog.likes.filter((u) => u !== username); // Unlike
    } else {
      blog.likes.push(username); // Like
    }

    await blog.save();
    res.json({ message: 'Updated like status', likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Error updating like', error: err.message });
  }
});

module.exports = router;
