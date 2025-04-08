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

export const getTagIds = async (tagsJSON) => {
  if (!tagsJSON) throw new Error("Tags are required");

  let parsedTags;
  try {
    parsedTags = JSON.parse(tagsJSON);
  } catch (err) {
    throw new Error("Invalid tag JSON format");
  }

  if (!Array.isArray(parsedTags)) {
    throw new Error("Tags must be an array");
  }

  const tagIds = await Promise.all(
    parsedTags.map(async (tagRaw) => {
      const tagName = tagRaw.trim().toLowerCase();

      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        tag = new Tag({ name: tagName, posts: [] });
        await tag.save();
      }

      return tag._id;
    })
  );

  return tagIds;
};
