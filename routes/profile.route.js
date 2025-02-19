import express from 'express';
import multer from 'multer';
import { getUserFromToken, editProfile, isUserNamePresent, getUserWithProfile, updateProfile } from '../controllers/Profile.Controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get profile details
router.get('/me', getUserFromToken);
router.put('/me',upload.single("profileImg"), editProfile);
router.post("/check-username", isUserNamePresent);

// Update profile (including profile image)
router.put("/:userId", upload.single("profileImg"), updateProfile);

// Get profile details
router.get("/:userId", getUserWithProfile);

export default router;
