import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import sendMail from '../utils/emailService.js';
import User from '../models/User.js';

const router = express.Router();

// Redirect to Google OAuth
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle OAuth callback
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  async (req, res) => {
    const { id, email, name } = req.user;

    try {
      // Check if user is verified
      let user = await User.findById(id);

      if (!user) {
        // If user is not found, create a new one
        user = await User.create({ id, email, name, isVerified: false });
      }

      if (!user.isVerified) {
        // Generate a verification token
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send verification email
        const verificationLink = `${process.env.CLIENT_URI}/verify-email?token=${verificationToken}`;
        const emailContent = `
          <h1>Verify Your Email</h1>
          <p>Hello ${name || email.split('@')[0]},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
        `;
        await sendMail({
          to: email,
          subject: 'Email Verification Required',
          html: emailContent,
        });
      }

      // Generate JWT
      const payload = { id: user._id, email: user.email, name: user.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Set JWT token as a cookie
      res.cookie('jwt', token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.redirect(`${process.env.CLIENT_URI}/dashboard`);
    } catch (error) {
      console.error(error);
      res.redirect('/login'); // Redirect to login on error
    }
  }
);

export default router;
