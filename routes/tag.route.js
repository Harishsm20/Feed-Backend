import express from "express";
import { recommendTags } from "../controllers/tag.Controller.js";

const router = express.Router();

router.get("/tags/recommend", async (req, res) => {
  const { prefix } = req.query;
  try {
    const tags = await recommendTags(prefix);
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
