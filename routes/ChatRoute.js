import express from 'express';
import { createChat, findChat, userChats } from '../controllers/ChatController.js';

const router = express.Router();

router
    .post("/", createChat)
    .get("/:userId", userChats)
    .get("/find/:firstId/:secondId", findChat);

export default router;