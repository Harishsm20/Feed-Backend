const express = require('express');
const { getAllPosts, createPost } = require('../controllers/blogController');
const router = express.Router();

router.get('/posts', getAllPosts);
router.post('/posts', createPost);

module.exports = router;
