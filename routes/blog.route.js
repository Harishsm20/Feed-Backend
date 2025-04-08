import express from "express";
import multer from 'multer';

import { createBlog, deleteBlog, searchPostsByTag } from "../controllers/blog.Controller.js";

// import { createBlog, deleteBlog, searchPostsByTag } from "../controllers/BlogController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new blog (Requires authentication)
router.post("/create", authenticateUser, upload.single("headImage"), createBlog);

// Delete a blog (Requires authentication)
router.delete("/delete/:blogId", authenticateUser, deleteBlog);

// Search blogs by tag
router.get("/search/tag/:tagName", searchPostsByTag);

export default router;