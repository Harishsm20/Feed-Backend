import express from 'express';
import { getUserFromToken, editProfile, isUserNamePresent } from '../controllers/Profile.Controller.js'; 

const router = express.Router();

// Get profile details
router.get('/me',getUserFromToken);
router.put('/me', editProfile)
router.post("/check-username", isUserNamePresent);

export default router;
