import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/emailService.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { createUserWithProfile } from '../utils/user.service.js';

const router = express.Router();

// Redirect to Google OAuth
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle OAuth callback
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  async (req, res) => {
    const { id: googleId, email, name } = req.user;

    try {
      // Check if user already exists by email
      let user = await User.findOne({ email });

      if (user) {
        // If user exists, check if it already has a Google ID
        if (!user.googleId) {
          user.googleId = googleId;
          user.isVerified = true; // Mark Google users as verified
          await user.save();
        }
      } else {
        // If user doesn't exist, create a new user and profile
        user = await createUserWithProfile({
          name,
          email,
          password: null, // No password for Google sign-up
          googleId,
          isVerified: true, // Google users are verified by default
        });

        // Send a welcome email
        const emailContent = `
          <h1>Welcome to Our Platform</h1>
          <p>Hello ${name || email.split('@')[0]},</p>
          <p>We're excited to have you on board. Your profile has been created successfully.</p>
          <p>Feel free to update your profile and explore the platform.</p>
        `;
        await sendMail({
          to: email,
          subject: 'Welcome to Our Platform',
          html: emailContent,
        });
      }

      // Ensure a profile exists for the user
      const profileExists = await Profile.findOne({ user: user._id });
      if (!profileExists) {
        await Profile.create({
          user: user._id,
          userName: name.toLowerCase().replace(/\s+/g, '_'),
          bio: '',
          socialLinks: {},
        });
      }

      // Generate JWT
      const payload = { id: user._id, email: user.email, name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set JWT token as a cookie
      res.cookie('jwt', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.redirect(`${process.env.CLIENT_URI}/dashboard`);
    } catch (error) {
      console.error('Error during Google sign-up:', error);
      res.redirect('/login'); // Redirect to login on error
    }
  }
);

export default router;
