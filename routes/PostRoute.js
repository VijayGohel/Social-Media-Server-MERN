import express from "express";
import { createPost, deletePost, getPost, updatePost } from "../controllers/PostController.js";

const router = express.Router();

router
.get("/:id", getPost)
.post("/", createPost)
.patch("/:id", updatePost)
.delete("/:id", deletePost);

export default router;