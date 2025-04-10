import Blog from "../models/Blog.js";
import { getImageURL } from "../controllers/image.controller.js";

export const getPostsByIds = async (ids) => {
  const posts = await Blog.find({ _id: { $in: ids } }).populate("tags");

  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
      const headImageUrl = post.headImage
        ? await getImageURL(post.headImage)
        : null;

      return {
        _id: post._id,
        title: post.title,
        description: post.description,
        tags: post.tags,
        headImageUrl,
        createdAt: post.createdAt,
      };
    })
  );

  return postsWithImages;
};
