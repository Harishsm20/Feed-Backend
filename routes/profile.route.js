import express from 'express';
import multer from 'multer';
import { getUserFromToken, editProfile, isUserNamePresent, getUserWithProfile } from '../controllers/Profile.Controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get profile details
router.get('/me', getUserFromToken);
router.put('/me',upload.single("profileImg"), editProfile);
router.post("/check-username", isUserNamePresent);


// Get profile details
router.get("/:userId", getUserWithProfile);

export default router;
