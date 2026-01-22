import express from "express";
import Topic from "../models/Topic.js";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/topics
// @desc    Get all topics
// @access  Public
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("category", "name")
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(topics);
  } catch (error) {
    console.error("Get topics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/topics
// @desc    Create a topic
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, body, category } = req.body;

    if (!title || !body || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const topic = new Topic({
      title,
      body,
      category,
      author: req.user.userId,
    });

    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    console.error("Create topic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
