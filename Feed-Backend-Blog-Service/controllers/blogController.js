const BlogPost = require('../models/blogPostModel');

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
};

// Create a new blog post
exports.createPost = async (req, res) => {
  const { title, content, author, tags } = req.body;
  const newPost = new BlogPost({ title, content, author, tags });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog post' });
  }
};
