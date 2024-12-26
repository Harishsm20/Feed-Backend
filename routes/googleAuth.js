import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect to Google OAuth
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle OAuth callback
router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: true }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect after successful login
  }
);

export default router;
