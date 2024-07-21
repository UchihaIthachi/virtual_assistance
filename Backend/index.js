import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { promises as fs } from "fs";
import axios from "axios";
import voice from "elevenlabs-node";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import textToSpeech from "@google-cloud/text-to-speech";

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

const ANIMATIONS = [
  "idle",
  "happy",
  "sad",
  "loser",
  "dance",
  "loser",
  "jump",
  "kiss",
];
const FACIAL_EXPRESSIONS = [
  "smile",
  "sad",
  "angry",
  "surprised",
  "funnyFace",
  "default",
];

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "pNInz6obpgDQGcFmaJgB";
const fileName = "audio.mp3";

const HF_API_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("Received message from frontend:", userMessage);

    if (!userMessage) {
      const responseMessage = {
        text: `Hi! how's it going?`,
        audio: await audioFileToBase64("audios/intro.wav"),
        lipsync: await readJsonTranscript("audios/intro.json"),
        facialExpression: "smile",
        animation: "idle",
      };
      console.log("Sending response to frontend:", responseMessage);
      res.send({ messages: [responseMessage] });
      return;
    }

    const rasaResponse = await getModelResponse(
      userMessage,
      conversationHistory
    );

    const messages = await Promise.all(
      rasaResponse.map(async (rasaMessage, index) => {
        const message = {
          text: rasaMessage.text,
          facialExpression: "default",
          animation: "idle",
          audio: await generateSpeech(rasaMessage.text, index),
          lipsync: await lipSyncMessage(index),
        };
        console.log("Generated message:", {
          text: message.text,
          facialExpression: message.facialExpression,
          animation: message.animation,
        });
        return message;
      })
    );

    const logMessages = messages.map(({ audio, ...rest }) => rest);
    console.log("Sending response to frontend:", logMessages);
    res.send({ messages });
  } catch (error) {
    console.log("Error:", error);
    const fallbackMessage = {
      text: "Sorry I'm a dumbo!",
      audio: await audioFileToBase64("audios/dumbo.wav"),
      lipsync: await readJsonTranscript("audios/dumbo.json"),
      facialExpression: Math.random() < 0.5 ? "funnyFace" : "default",
      animation: "dance",
    };
    const fallbackMessageLog = { ...fallbackMessage };
    delete fallbackMessageLog.audio;

    console.log("Sending fallback response to frontend:", fallbackMessageLog);
    res.send({ messages: [fallbackMessage] });
  }
});

const getModelResponse = async (userMessage, history) => {
  const details = await readDetailsFromJsonFile();
  const contextWindow = history.slice(-5);

  // Customize the system instructions with details from JSON
  const personalizedInstructions = `
  [SYSTEM] You are ${details.Name}, a ${details.Role}. 
  Your task is to respond to user queries concisely and accurately.

  1. **Greeting**: Begin with a friendly greeting if the user starts the conversation.
  2. **Response**: 
    - Provide clear, direct answers to the user's questions.
    - Avoid unnecessary details and introductions.
    - Use a conversational and friendly tone.
  3. **Fallback**: 
    - If you cannot understand or address the query, respond with the fallback message.
    - Ask for clarification if needed.

  Additional Context:
  - **Birthday**: ${details.Birthday}
  - **Occupation**: ${details.Occupation}
  - **Hobbies**: ${details.Hobbies.join(", ")}
  - **Favorite Language**: ${details.Favorite_language}

  Recent conversation:
  ${contextWindow.map((m) => `${m.role}: ${m.text}`).join("\n")}

  Here is the user's query: [QUESTION]
  `;

  const formattedPrompt = personalizedInstructions.replace(
    "[QUESTION]",
    userMessage
  );
  const headers = {
    Authorization: `Bearer ${HF_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    inputs: formattedPrompt,
    parameters: {
      max_new_tokens: 300,
    },
  });

  try {
    const response = await axios.post(HF_API_URL, body, { headers });
    console.log("API response:", response.data);

    if (response.data.length > 0 && response.data[0].generated_text) {
      // Extract and clean the response text
      let responseText = response.data[0].generated_text
        .split("\n")
        .slice(-1)[0]
        .trim();

      // Remove unwanted prefixes like "**Answer**:"
      const cleanedText = responseText.replace(/^\*\*.*?\*\*:\s*/, "");

      return [{ text: cleanedText }];
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error(
      "Error in getModelResponse:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Initialize the Google Cloud Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient();

const generateSpeech = async (textInput, index) => {
  const fileName = `audios/audio_${index}.mp3`;

  try {
    // Construct the request
    const request = {
      input: { text: textInput },
      voice: { languageCode: "en-US", ssmlGender: "MALE" }, // You can choose the voice gender and language code
      audioConfig: { audioEncoding: "MP3" },
    };

    // Perform the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);

    // Write the binary audio content to a file
    await fs.writeFile(fileName, response.audioContent, "binary");

    // Convert the audio file to Base64 and return it
    return await audioFileToBase64(fileName);
  } catch (error) {
    console.log("Error in generateSpeech:", error);
    throw error;
  }
};

// Determine OS and set the path to ffmpeg and rhubarb executable accordingly
const isWindows = os.platform() === "win32";
const ffmpegPath = isWindows
  ? path.join(__dirname, "ffmpeg-win", "bin", "ffmpeg.exe")
  : path.join(__dirname, "ffmpeg", "bin", "ffmpeg");
const rhubarbPath = isWindows
  ? path.join(__dirname, "rhubarb-win", "rhubarb.exe")
  : path.join(__dirname, "rhubarb");

// Set the path to ffmpeg executable
ffmpeg.setFfmpegPath(ffmpegPath);

const lipSyncMessage = async (index) => {
  const mp3FileName = path.join(__dirname, `audios/audio_${index}.mp3`);
  const wavFileName = path.join(__dirname, `audios/audio_${index}.wav`);

  try {
    console.log("Converting MP3 to WAV:", mp3FileName, wavFileName);
    await execCommand(`${ffmpegPath} -y -i ${mp3FileName} ${wavFileName}`);
    await execCommand(
      `${rhubarbPath} -f json -o audios/audio_${index}.json ${wavFileName} -r phonetic`
    );

    return await readJsonTranscript(`audios/audio_${index}.json`);
  } catch (error) {
    console.error("Error in lipSyncMessage:", error);
    throw error;
  }
};

const execCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

const readDetailsFromJsonFile = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "details.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading details:", error);
    throw error;
  }
};

app.listen(port, () => {
  console.log(`Virtual Jan listening on port ${port}`);
});
