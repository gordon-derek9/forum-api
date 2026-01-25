import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user + hash password
    const user = new User({ username, email });
    await user.setPassword(password);

    // save to MongoDB
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user with USERNAME (or email fallback) + return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // allow username OR email (username required by project spec)
    const identifier = (username || email || "").trim();

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // find user by username OR email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // verify password
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/auth/protected
// @desc    Test protected route
// @access  Private
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
