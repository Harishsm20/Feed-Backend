import Blog from "../models/Blog.js";
import Tag from "../models/Tags.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";
import { uploadImageInBucket, getImageURL} from "./image.controller.js";
import { getPostsByIds } from "../utils/postService.js";
import { getTagIds } from "./tag.Controller.js";

// Read Post from Id
export const fetchPostsFromIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.every(id => typeof id === "string")) {
      return res.status(400).json({ message: "Invalid or missing post IDs" });
    }

    const posts = await getPostsByIds(ids);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts by IDs:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// Search posts by tag name
export const searchPostsByTag = async (req, res) => {
  try {
    const { tagName } = req.params;
    const tag = await Tag.findOne({ name: tagName }).populate("posts");
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    res.status(200).json(tag.posts);
  } catch (error) {
    console.error("Error searching posts by tag:", error);
    res.status(500).json({ message: "Failed to search posts" });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    console.log(req.body)

    let { title, description, /*subImages,*/} = req.body;
    const tags = await getTagIds(req.body.tags);
    

    let headImage = req.file;

    let headImg = headImage || null;

    if(headImage != null){
      try{
        headImg = await uploadImageInBucket(
          headImage.buffer,
          headImage.mimetype,
        );
      }
      catch(err){
        console.log("Error in uploading image")
      }
    }

    let subImages = [];
    if (req.files?.subImages) {
      const uploadPromises = req.files.subImages.map(async (file) =>
        uploadImageInBucket(file.buffer, file.mimetype)
      );
      subImages = await Promise.all(uploadPromises);
    }

    const newBlog = new Blog({
      title,
      description,
      headImage: headImg,
      subImages,
      tags,
      author: user._id,
      profile: profile._id,
    });
    await newBlog.save();

    // Store post ID in profile model
    if (!Array.isArray(profile.posts)) {
      profile.posts = [];
    }
    profile.posts.push(newBlog._id);
    await profile.save();
    
    

    await Promise.all(
      tags.map((tagId) =>
        Tag.findByIdAndUpdate(tagId, {
          $addToSet: { posts: newBlog._id },
        })
      )
    );

    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Remove blog from each tag's post list
    await Promise.all(
      blog.tags.map(async (tagId) => {
        const tag = await Tag.findById(tagId);
        if (tag) {
          tag.posts = tag.posts.filter(
            (postId) => postId.toString() !== blogId
          );
          if (tag.posts.length === 0) {
            await Tag.findByIdAndDelete(tagId);
          } else {
            await tag.save();
          }
        }
      })
    );

    // Remove blog ID from profile's posts array
    await Profile.updateOne(
      { _id: blog.profile },
      { $pull: { posts: blog._id } }
    );

    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
