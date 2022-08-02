import express from "express";
import { deleteUser, followUser, unfollowUser, getUser, updateUser } from "../controllers/UserController.js";

const router  = express.Router();

router.get("/:id", getUser)
.patch("/:id", updateUser)
.delete("/:id", deleteUser)
.patch("/:id/follow", followUser)
.patch("/:id/unfollow", unfollowUser);

export default router;