// image.route.js
import express from "express";
import { getImageURL } from "../controllers/image.controller.js";

const router = express.Router();

// POST endpoint to handle the request and generate a signed image URL
router.post("/getImageURL", async (req, res) => {
  try {
    const { imgName } = req.body;  // Read imgName from request body

    if (!imgName) {
      return res.status(400).json({ message: "Image name is required" });
    }

    // Call the function to get the signed URL
    const imageUrl = await getImageURL(imgName);
    
    // Return the generated image URL
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error in getImageURL route:", error);
    res.status(500).json({ message: "Error generating image URL" });
  }
});

export default router;