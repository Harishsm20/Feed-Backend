import express from 'express';
import { getUserFromToken, editProfile, isUserNamePresent, getUserWithProfile, updateProfile } from '../controllers/Profile.Controller.js'; 

const router = express.Router();
const upload = multer(); // Middleware to handle file uploads

// Get profile details
router.get('/me',getUserFromToken);
router.put('/me', editProfile)
router.post("/check-username", isUserNamePresent);

// Update profile (including profile image)
router.put("/:userId", upload.single("profileImg"), updateProfile);

// Get profile details
router.get("/:userId", getUserWithProfile);

export default router;
