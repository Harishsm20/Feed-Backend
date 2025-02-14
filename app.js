import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from "body-parser";

// Config files
import connectDB from './config/db.js';

// Route Files
import authRoutes from './routes/auth.route.js';
import googleAuthRoutes from './routes/googleAuth.route.js';
import profileRoutes from './routes/profile.route.js';
import imageRoutes from './routes/image.route.js'

import cors from 'cors'
import cookieParser from 'cookie-parser';
import './config/passport.js';


dotenv.config();
connectDB();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URI,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Increase JSON and URL-encoded payload limits
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Express-Session Configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        }),
    })
);
  
// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/image', imageRoutes);

export default app;