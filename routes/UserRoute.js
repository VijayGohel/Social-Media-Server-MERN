import express from "express";
import { deleteUser, followUser, unfollowUser, getUser, updateUser, getAllUsers } from "../controllers/UserController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router  = express.Router();

router.get("/:id", getUser)
.get("/", getAllUsers)
.patch("/:id", authMiddleware, updateUser)
.delete("/:id", authMiddleware, deleteUser)
.patch("/:id/follow", authMiddleware, followUser)
.patch("/:id/unfollow", authMiddleware, unfollowUser);

export default router;