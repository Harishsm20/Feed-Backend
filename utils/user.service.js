import User from '../models/User.js';
import Profile from '../models/Profile.js';

export const createUserWithProfile = async ({ name, email, password, googleId, isVerified }) => {
  try {
    const user = new User({ name, email, googleId, isVerified });

    // Hash the password only if it is provided
    if (password) {
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the user to the database
    await user.save();

    // Create a profile for the user
    const profile = new Profile({
      user: user._id,
      userName: name.toLowerCase().replace(/\s+/g, '_'), // Default username
      bio: '',
      socialLinks: {},
    });
    await profile.save();

    return user;
  } catch (error) {
    throw new Error('Error creating user and profile: ' + error.message);
  }
};
