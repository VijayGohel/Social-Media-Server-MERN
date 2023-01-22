import express from "express";
import { deleteUser, followUser, unfollowUser, getUser, updateUser, getAllUsers } from "../controllers/UserController.js";

const router  = express.Router();

router.get("/:id", getUser)
.get("/", getAllUsers)
.patch("/:id", updateUser)
.delete("/:id", deleteUser)
.patch("/:id/follow", followUser)
.patch("/:id/unfollow", unfollowUser);

export default router;