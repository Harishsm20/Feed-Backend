// authentication-service/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/dbConfig'); 
const authController = require('./controllers/authController'); 
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL })); 

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Error connecting to the database:', err));

// Sync database models (User and Otp)
sequelize.sync()
  .then(() => console.log('Tables synced with the database'))
  .catch(err => console.log('Error syncing tables:', err));

// Routes
app.use('/api/auth', authController); 

// Protected route example (requires JWT token)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is a protected route!` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});
