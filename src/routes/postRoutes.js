import express from "express";
import Post from "../models/Post.js";
import Topic from "../models/Topic.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get posts (optionally filter by topicId)
 * @access  Public
 *
 * Usage:
 *   /api/posts                -> all posts
 *   /api/posts?topicId=XXXX   -> posts for a topic
 */
router.get("/", async (req, res) => {
  try {
    const { topicId } = req.query;

    const filter = {};
    if (topicId) filter.topic = topicId;

    const posts = await Post.find(filter)
      .populate("author", "username")
      .populate("topic", "title")
      .sort({ createdAt: 1 }); // oldest -> newest for thread view

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a post (reply) for a topic
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { body, topic } = req.body;

    if (!body || !topic) {
      return res.status(400).json({ message: "Body and topic are required" });
    }

    // Ensure topic exists
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(400).json({ message: "Invalid topic" });
    }

    const post = new Post({
      body,
      topic,
      author: req.user.userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
