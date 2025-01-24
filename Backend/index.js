// Import dependencies
import express from "express";
import cors from "cors";
import { config } from "./config/dotenvConfig.js"; // Environment config
import routes from "./routes/index.js"; // Centralized route management

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import voice from "elevenlabs-node";
import { fileURLToPath } from "url";
import path from "path";

import { chatHandler } from "./controllers/chatController.js";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

let conversationHistory = [];

const addMessageToHistory = (message) => {
  conversationHistory.push(message);
};

const getConversationHistory = () => {
  return conversationHistory;
};




const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

app.post("/chat", chatHandler);

app.listen(port, () => {
  console.log(`Virtual Jan listening on port ${port}`);
});

// const isWindows = os.platform() === "win32";
// const ffmpegPath = isWindows
//   ? path.join(__dirname, "ffmpeg-win", "bin", "ffmpeg.exe")
//   : path.join(__dirname, "ffmpeg", "bin", "ffmpeg");
// const rhubarbPath = isWindows
//   ? path.join(__dirname, "rhubarb-win", "rhubarb.exe")
//   : path.join(__dirname, "rhubarb");