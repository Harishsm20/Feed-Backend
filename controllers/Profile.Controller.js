import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Register a new user and create a profile
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create user
    const user = await User.create({ name, email, password });

    // Create profile for the user
    await Profile.create({
      user: user._id,
      userName: name.toLowerCase().replace(/\s+/g, '_'), // Generate a default username
      bio: '',
      socialLinks: {},
    });

    res.status(201).json({ message: 'User and profile created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user and profile' });
  }
};


export const getUserWithProfile = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate('profile');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const profile = await Profile.findOne({ user: user._id });
      res.status(200).json({ user, profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user and profile' });
    }
  };