import { Router } from "express";
import voiceRoutes from "./voiceRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = Router();

// Add route handlers
router.use("/voices", voiceRoutes); // Routes for /voices
router.use("/chat", chatRoutes);   // Routes for /chat

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a welcome message.
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", (req, res) => res.send("Hello World!"));

export default router;
