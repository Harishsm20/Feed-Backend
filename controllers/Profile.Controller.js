import User from '../models/User.js';
import Profile from '../models/Profile.js';
import jwt from 'jsonwebtoken'

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

  
  // Get profile details
  export const getUserFromToken =  async (req, res) => {
    const token = req.cookies.jwt; // JWT token from cookies
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password'); // Exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const profile = await Profile.findOne({ user: user._id });
      // console.log("Profile: ", profile);
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
  
      res.status(200).json({ user, profile });
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  
  //Edit Profile
  export const editProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming middleware adds user info to req
      const { bio, socialLinks, header } = req.body;  
      const profile = await Profile.findOneAndUpdate(
        { user: userId },
        { bio, socialLinks, header },
        { new: true }
      );
  
      res.json({ profile });
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  };
  
  // Availabilty of UserName
  export const isUserNamePresent =  async (req, res) => {
    const { username } = req.body;
    const token = req.cookies.jwt;

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
  
    try {
      const user = await Profile.findOne({ userName: username }); 
      if (user) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id === user.user.toString()){
          return res.json({isAvailable: true});
        }
        return res.json({ isAvailable: false });
      } else {
        return res.json({ isAvailable: true });
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }