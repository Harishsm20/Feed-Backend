import Tag from "../models/Tags.js";

// Recommend tags based on user input
export const recommendTags = async (prefix) => {
  try {
    const tags = await Tag.find({ name: { $regex: `^${prefix}`, $options: "i" } }) // Case-insensitive search
      .limit(10); // Limit to 10 suggestions
    
    return tags.map(tag => tag.name);
  } catch (error) {
    console.error("Error fetching tag recommendations:", error);
    throw new Error("Failed to fetch tag recommendations");
  }
};
