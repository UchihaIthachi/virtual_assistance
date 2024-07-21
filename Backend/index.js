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

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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

const system_instructions = `
[SYSTEM] You are Harshana Lakshara's virtual assistant.
Your task is to answer the question.
Keep conversation very short, clear, and concise.
Respond naturally and concisely to the user's queries.
Respond in a normal, conversational manner while being friendly and helpful.
The expectation is that you will avoid introductions and start answering the query directly. Only answer the question asked by the user. Do not say unnecessary things.
Begin with a greeting if the user initiates the conversation.
Avoid unnecessary introductions and answer the user's questions directly.
Here is the user's query: [QUESTION]
`;

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

    const rasaResponse = await getModelResponse(userMessage);

    const messages = await Promise.all(
      rasaResponse.map(async (rasaMessage, index) => {
        const message = {
          text: rasaMessage.text,
          facialExpression: "default",
          animation: "idle",
          audio: await textToSpeech(rasaMessage.text, index),
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

const getModelResponse = async (userMessage) => {
  const formattedPrompt = system_instructions.replace(
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
      // Extract the response text after the user's query
      const responseText = response.data[0].generated_text
        .split("\n")
        .slice(-1)[0]
        .trim();
      return [{ text: responseText }];
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

const textToSpeech = async (textInput, index) => {
  const fileName = `audios/audio_${index}.mp3`;
  try {
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    return await audioFileToBase64(fileName);
  } catch (error) {
    console.log("Error in textToSpeech:", error);
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

app.listen(port, () => {
  console.log(`Virtual Jan listening on port ${port}`);
});
