import { Router } from "express";
import voice from "elevenlabs-node";
import { config } from "../config/dotenvConfig.js";

const router = Router();

/**
 * @swagger
 * /voices:
 *   get:
 *     summary: Get available voices
 *     description: Fetches available voices using the ElevenLabs API.
 *     responses:
 *       200:
 *         description: List of voices
 *       500:
 *         description: Failed to fetch voices
 */
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
