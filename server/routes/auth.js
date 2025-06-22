const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');
const passport = require('passport');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists by email
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User with this email already exists' });

    // Check if username is already taken
    user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username is already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: "User registered successfully!", token, user: { id: user._id, username, email } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { username, bio } = req.body;
    try {
        const updatedFields = { bio };
        if (username) {
            updatedFields.username = username;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) { // Handle duplicate username error
            return res.status(400).json({ message: 'Username is already taken.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/user/:userId
// @desc    Get user profile by ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // On success, create a JWT for our user
    const payload = {
      user: {
        id: req.user.id,
        name: req.user.name,
        isAdmin: req.user.isAdmin,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        // This is tricky. We need to get the token to the client.
        // A common way is to redirect to a client page that saves the token.
        res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
      }
    );
  }
);

// @route   GET /api/auth
// @desc    Get current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
