const express = require('express');
const connectDB = require('./config/dbConfig');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/blog', blogRoutes);

app.listen(PORT, () => {
  console.log(`Feed-Backend-Blog-Service running on port ${PORT}`);
});
