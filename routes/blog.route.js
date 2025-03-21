import express from "express";
import { createBlog, deleteBlog, searchPostsByTag } from "../controllers/blog.controller.";

const router = express.Router();

router.post("/blogs", createBlog);
router.delete("/blogs/:id", deleteBlog);
router.get("/blogs/search", async (req, res) => {
  const { tag } = req.query;
  try {
    const blogs = await searchPostsByTag(tag);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
