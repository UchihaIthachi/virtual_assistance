import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  audioDir: process.env.AUDIO_DIR,
  rhubarbPath: process.env.RHUBARB_PATH,
  ffmpegPath: process.env.FFMPEG_PATH,
  hfApiUrl: process.env.HF_API_URL,
  hfApiUrl2 : process.env.HF_API_URL2,
  hfApiToken: process.env.HF_API_TOKEN,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
  logLevel: process.env.LOG_LEVEL || "info",
};
