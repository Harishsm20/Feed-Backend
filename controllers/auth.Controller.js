import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sendMail from '../utils/emailService.js';
import { createUserWithProfile } from '../utils/user.service.js';

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const name = `${firstName} ${lastName}`;

    // Create user and profile
    const user = await createUserWithProfile({
      name,
      email,
      password,
      googleId: null,
      isVerified: false,
    });

    // Generate a verification token
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URI}/verify-email?token=${verificationToken}`;
    const emailContent = `
      <h1>Welcome to Our Platform</h1>
      <p>Hello ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;
    await sendMail({
      to: email,
      subject: 'Email Verification',
      html: emailContent,
    });

    res.status(201).json({ message: 'User registered. Please verify your email.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const verifyToken = async (req, res) => {
  if (req.session.isVerified) {
    return res.status(200).json({ message: 'Already verified' });
  }

  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session.isVerified = true; 
    res.status(200).json({ message: 'Token valid', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const logout = async(req, res) =>{
  req.session.destroy(() =>{
    res.clearCookie('jwt');
    res.status(200).json({message: "Logged out"});
  })
}