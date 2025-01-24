import { Router } from "express";
import voiceRoutes from "./voiceRoutes.js";
import chatRoutes from "./chatRoutes.js";

const router = Router();

// Add route handlers
router.use("/", (req, res) => res.send("Hello World!"));
router.use("/voices", voiceRoutes);
router.use("/chat", chatRoutes);

export default router;
