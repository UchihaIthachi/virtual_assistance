import { Router } from "express";
import { chatHandler } from "../controllers/chatController.js";

const router = Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Chat endpoint
 *     description: Handles user input for the chatbot.
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/", async (req, res) => {
  try {
    await chatHandler(req, res);
  } catch (error) {
    console.error("Error in chatHandler:", error);
    res.status(500).json({ error: "Chat handler failed" });
  }
});

export default router;
