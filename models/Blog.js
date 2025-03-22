import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    headImage: { 
      type: String, 
      required: true 
    }, // URL of the main image
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Profile", 
      required: true 
    },
    subImages: { 
      type: [String], 
      validate: [(val) => val.length <= 3, "Max 3 images allowed"] 
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // References Tag model
  }, { timestamps: true });

export default mongoose.model('Blogs', blogSchema);
