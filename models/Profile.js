import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      unique: true,
    },
    header: {
      type: String,
    },
    bio: {
      type: String,
    },
    profileImg: {
      type: String, // Store the S3 key (image name)
      default: null,
    },
    socialLinks: {
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
      snapchat: { type: String, default: null },
      twitter: { type: String, default: null },
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blogs" }], // Store post IDs
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
