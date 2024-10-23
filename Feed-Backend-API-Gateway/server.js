// api-gateway/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Proxy requests based on the path
app.use('/auth', (req, res) => {
  axios({
    url: `${process.env.AUTH_SERVICE_URL}${req.originalUrl}`,
    method: req.method,
    data: req.body,
    headers: req.headers,
  }).then(response => res.send(response.data)).catch(err => res.status(err.response.status).send(err.response.data));
});

app.use('/blog', (req, res) => {
  axios({
    url: `${process.env.BLOG_SERVICE_URL}${req.originalUrl}`,
    method: req.method,
    data: req.body,
    headers: req.headers,
  }).then(response => res.send(response.data)).catch(err => res.status(err.response.status).send(err.response.data));
});

app.use('/media', (req, res) => {
  axios({
    url: `${process.env.MEDIA_SERVICE_URL}${req.originalUrl}`,
    method: req.method,
    data: req.body,
    headers: req.headers,
  }).then(response => res.send(response.data)).catch(err => res.status(err.response.status).send(err.response.data));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
