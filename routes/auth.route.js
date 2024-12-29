import express from 'express';
import { register, login, verifyEmail } from '../controllers/auth.Controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);

export default router;
