import express from "express";
import { createPost, deletePost, getPost, getTimeline, likePost, updatePost } from "../controllers/PostController.js";

const router = express.Router();

router
.get("/:id", getPost)
.post("/", createPost)
.patch("/:id", updatePost)
.delete("/:id", deletePost)
.patch("/:id/like", likePost)
.get("/:id/timeline", getTimeline);

export default router;