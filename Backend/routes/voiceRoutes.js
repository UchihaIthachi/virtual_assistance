import { Router } from "express";
import voice from "elevenlabs-node";
import { config } from "../config/dotenvConfig.js";

const router = Router();

// Handle fetching voices
router.get("/", async (req, res) => {
  try {
    const voices = await voice.getVoices(config.elevenLabsApiKey);
    res.json(voices);
  } catch (error) {
    console.error("Error fetching voices:", error);
    res.status(500).json({ error: "Failed to fetch voices" });
  }
});

export default router;
