const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

// @route   POST /api/blogs
// @desc    Create a new blog post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, content, coverImage, tags, status } = req.body;
  try {
    const newBlog = new Blog({
      title,
      content,
      coverImage,
      tags,
      status,
      author: req.user.id,
    });
    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs
// @desc    Get all blogs (with search and tag filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = { status: 'published' };

    if (search) {
      query.$text = { $search: search };
    }
    if (tag) {
      query.tags = tag;
    }

    const blogs = await Blog.find(query)
      .populate('author', ['name'])
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs/mydrafts
// @desc    Get current user's draft posts
// @access  Private
router.get('/mydrafts', auth, async (req, res) => {
  try {
    const drafts = await Blog.find({ author: req.user.id, status: 'draft' })
      .sort({ createdAt: -1 });
    res.json(drafts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blogs/user/:userId
// @desc    Get all blogs by a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId, status: 'published' })
      .populate('author', ['name'])
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs/upload
// @desc    Upload a blog image
// @access  Private
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }
  res.json({ url: req.file.path });
});

// @route   GET /api/blogs/:id
// @desc    Get a single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', ['name']).populate('comments.user', ['name']);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, coverImage, tags, status } = req.body;
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    // Check user
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content, coverImage, tags, status } },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    // Check user
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Blog removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/blogs/:id/like
// @desc    Like or unlike a blog post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    // Check if the post has already been liked by this user
    if (blog.likes.some((like) => like.toString() === req.user.id)) {
      // Unlike it
      blog.likes = blog.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      // Like it
      blog.likes.unshift(req.user.id);
    }
    await blog.save();
    res.json(blog.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blogs/:id/comment
// @desc    Comment on a blog post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
    const { text } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        const newComment = {
            text: text,
            user: req.user.id,
        };
        blog.comments.unshift(newComment);
        await blog.save();
        const populatedBlog = await Blog.findById(req.params.id).populate('comments.user', ['name']);
        res.json(populatedBlog.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE /api/blogs/:id/comments/:comment_id
// @desc     Delete a comment
// @access   Private
router.delete('/:id/comments/:comment_id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const comment = blog.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    blog.comments = blog.comments.filter(({ id }) => id !== req.params.comment_id);

    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
