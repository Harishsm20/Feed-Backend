import Blog from "../models/Blog.js";
import Tag from "../models/Tags.js";

// Search posts by tag name
export const searchPostsByTag = async (tagName) => {
  try {
    const tag = await Tag.findOne({ name: tagName }).populate("posts");
    if (!tag) return [];
    
    return tag.posts; // Return all posts with the tag
  } catch (error) {
    console.error("Error searching posts by tag:", error);
    throw new Error("Failed to search posts");
  }
};


// Create a new blog
export const createBlog = async (blogData) => {
  try {
    const { title, description, headImage, author, subImages, tags } = blogData;
    
    // Ensure only 3 sub-images are allowed
    if (subImages.length > 3) {
      throw new Error("Only up to 3 sub-images are allowed.");
    }

    // Find or create tags
    const tagObjects = await Promise.all(tags.map(async (tagName) => {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = new Tag({ name: tagName, posts: [] });
        await tag.save();
      }
      return tag;
    }));

    // Create blog post
    const blog = new Blog({
      title,
      description,
      headImage,
      author,
      subImages,
      tags: tagObjects.map(tag => tag._id)
    });

    await blog.save();

    // Link blog to each tag
    await Promise.all(tagObjects.map(async (tag) => {
      tag.posts.push(blog._id);
      await tag.save();
    }));

    return blog;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
};


export const deleteBlog = async (blogId) => {
  try {
    // Find the blog
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error("Blog not found");

    // Remove blog from each tag's post list
    await Promise.all(blog.tags.map(async (tagId) => {
      const tag = await Tag.findById(tagId);
      if (tag) {
        tag.posts = tag.posts.filter(postId => postId.toString() !== blogId);
        if (tag.posts.length === 0) {
          await Tag.findByIdAndDelete(tagId); // Delete unused tag
        } else {
          await tag.save();
        }
      }
    }));

    // Delete blog
    await Blog.findByIdAndDelete(blogId);

    return { message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
};