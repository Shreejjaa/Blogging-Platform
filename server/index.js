const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Passport config
require('./config/passport')(passport);

// Sessions
app.use(
  session({
    secret: 'keyboard cat', // Replace with a real secret in your .env
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect DB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const adminRoutes = require('./routes/admin'); // Corrected from adminUtils
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes); // Corrected from adminUtils
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
