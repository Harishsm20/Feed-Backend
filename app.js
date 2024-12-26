import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import googleAuthRoutes from './routes/googleAuth.js';
import cors from 'cors'
import './config/passport.js'; // Import Passport configuration

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);

export default app;