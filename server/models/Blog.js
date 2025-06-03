const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [commentSchema],
  likes: {
    type: [String],
    default: []
  },
  categories: {
    type: [String],
    default: []
  }
});

// ✅ This line was missing
module.exports = mongoose.model('Blog', blogSchema);
