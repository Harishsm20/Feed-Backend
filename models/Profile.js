import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      // required: true,
    },
    header: {
      type: String,
    },
    bio: {
      type: String,
    },
    socialLinks: {
      instagram: {
        type: String,
        default: null,
      },
      linkedin: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
    },
    posts: {
      type: Number,
      default: 0, 
    },
    followers: {
      type: Number,
      default: 0, 
    },
    following: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
