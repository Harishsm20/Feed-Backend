import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: { 
        type: String, 
        unique: true, 
        required: true 
    }, // Unique tag name
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blogs" }] // Stores Blog IDs
}, { timestamps: true });

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
