import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/UserController.js";

const router  = express.Router();

router.get("/:id", getUser);
router.patch("/:id", updateUser).delete("/:id", deleteUser);
export default router;