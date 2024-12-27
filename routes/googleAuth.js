import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Redirect to Google OAuth
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle OAuth callback
router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    const { id, email, name } = req.user;

    const payload = {
      id: id,
      email: email,
      name: name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set JWT token as a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'Strict',
    });

    res.redirect(`${process.env.CLIENT_URI}/dashboard`);
  }
);

export default router;
