import sharp from 'sharp';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import jwt from 'jsonwebtoken'
import { uploadImageInBucket, getImageURL, deleteImageFromBucket } from './image.controller.js';

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
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Get signed URL for profile image
    const imageUrl = profile.profileImg ? await getImageURL(profile.profileImg) : null;

    res.status(200).json({ profile, imageUrl });
  } catch (error) {
    console.error("Error fetching user and profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
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

      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      const imageUrl = profile.profileImg ? await getImageURL(profile.profileImg) : null;
      res.status(200).json({ user, profile , imageUrl});
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  

  //Edit Profile
  export const editProfile = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password'); // Exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      let { bio, socialLinks, header } = req.body;
      const profileImgFile = req.file;
      
      // Find the profile
      const profile = await Profile.findOne({ user: user._id });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      let uploadedImgName = profile.profileImg || null;
      
      if (typeof socialLinks === 'string') {
        try {
          socialLinks = JSON.parse(socialLinks);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid socialLinks format' });
          }
        }
        // Check if new is being uploaded""
        if (profileImgFile != null && profile.profileImg != null) {
          await deleteImageFromBucket(profile.profileImg);
        }

        if(profileImgFile != null){
        try {
            uploadedImgName = await uploadImageInBucket(
              profileImgFile.buffer,
              profileImgFile.mimetype
            );
          } catch (error) {
            console.error("Error in getImageURL route:", error);
          }
        }

        // Update profile details
        profile.bio = bio || profile.bio;
        profile.socialLinks = socialLinks || profile.socialLinks;
        profile.header = header || profile.header;
        profile.profileImg = uploadedImgName;

        await profile.save();

        res.status(200).json({ message: "Profile updated", profile, uploadedImgName });
    } catch (err) {
        console.error("Error updating profile:", err);
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

