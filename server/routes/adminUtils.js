const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path if needed

// TEMP route to make a specific user an admin
router.post('/make-admin', async (req, res) => {
  const { email } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User promoted to admin', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

module.exports = router;
