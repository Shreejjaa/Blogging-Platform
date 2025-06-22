const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const router = express.Router();

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }
  res.json({ url: req.file.path });
});

module.exports = router; 