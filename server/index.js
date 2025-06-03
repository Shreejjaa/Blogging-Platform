const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const adminUtils = require('./routes/adminUtils'); // ✅ Move it here

app.use('/api/auth', authRoutes);
app.use('/api/posts', blogRoutes);
app.use('/api/admin', adminUtils); // ✅ Register before listen()

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
