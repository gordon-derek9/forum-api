import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", postRoutes);

// Root test route
app.get("/", (req, res) => {
  res.json({ message: "Forum API running" });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
