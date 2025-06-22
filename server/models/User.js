const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false, // Made optional since we have username
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // <-- Not required for OAuth users
  },
  isAdmin: {
    type: Boolean,
    default: false // ✅ New admin flag
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
