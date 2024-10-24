// authentication-service/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authController = require('./controllers/authController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authController);

app.listen(PORT, () => {
  console.log(`Authentication Service running on port ${PORT}`);
});
