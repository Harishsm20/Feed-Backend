// authentication-service/controllers/authController.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Sequelize model
const Otp = require('../models/otpModel');    // Sequelize model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Email Transporter Error:', error);
    } else {
        console.log('Email Transporter is ready');
    }
});

// Function to generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
};

// Signup with OTP
router.post('/signup', async (req, res) => {
    const { name, email, password, otp } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (otp) {
            const otpRecord = await Otp.findOne({ where: { email } });
            if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });

            // Remove OTP after successful signup
            await Otp.destroy({ where: { email } });

            res.status(201).json({ message: "Signup successful" });
        } else {
            const otpCode = generateOTP();
            const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 mins

            await Otp.upsert({ email, otp: otpCode, expiresAt: otpExpiration });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "OTP for Signup",
                text: `Your OTP for signup is ${otpCode}. This OTP is valid for 2 minutes.`,
            });

            res.json({ message: "OTP sent to your email" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login with JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const payLoad = { id: user.id, email: user.email };
            const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.json({ accessToken });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
