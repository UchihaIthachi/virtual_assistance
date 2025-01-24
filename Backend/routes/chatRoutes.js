import { Router } from "express";
import { chatHandler } from "../controllers/chatController.js";

const router = Router();

// Handle chat endpoint
router.post("/", async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (error) {
    console.error("Error in chatHandler:", error);
    res.status(500).json({ error: "Chat handler failed" });
  }
});

export default router;
