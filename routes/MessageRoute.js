import express from "express";
import { addMessage, getMessages } from "../controllers/MessageController.js";

const router = express.Router();

router
    .get("/:chatId", getMessages)
    .post("/", addMessage);

export default router;
