import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the path to point to Backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Assumes .env is in the Backend directory

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
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
};
