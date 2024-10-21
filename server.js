const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const authController = require('./controllers/authController');

const PORT = 3001;
require('dotenv').config();

// Connect to MongoDB
const connect = async () => {
  console.log('Attempting to connect to MongoDB...');
  try {
      await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connect();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

// Use controllers for routing
app.use('/auth', authController); 

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});