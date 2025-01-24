import express from "express";
import chatRoutes from "./chatRoutes.js"; // Adjust the path if necessary

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("API is working!");
});

// Add specific route groups
router.use("/chat", chatRoutes); // Ensure chatRoutes.js exists

export default router;
