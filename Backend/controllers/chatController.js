// import { getEmotion } from "../services/emotionService.js";
// import { generateSpeech } from "../services/textToSpeechService.js";
// import { lipSyncMessage } from "../services/lipSyncService.js";
import { getEmotion } from "../services/emotionService.js";
import { generateSpeech } from "../services/textToSpeechService.js";
import { getModelResponse } from "../services/modelService.js";
import {lipSyncMessage} from "../services/lipSyncService.js";
import { convertAudioToBase64 , readJsonTranscript} from "../utils/fileUtils.js";

const ANIMATIONS = {
  joy: "happy",
  sadness: "sad",
  anger: "loser",
  surprise: "jump",
  fear: "jump",
  disgust: "loser",
  neutral: "idle",
};

const FACIAL_EXPRESSIONS = {
  joy: "smile",
  sadness: "sad",
  anger: "angry",
  surprise: "surprised",
  fear: "fearful",
  disgust: "disgusted",
  neutral: "default",
};

let conversationHistory = []; // Store conversation history globally

export const chatHandler = async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("Received message from frontend:", userMessage);

    if (!userMessage) {
      const responseMessage = {
        text: "Hi! how's it going?",
        audio: await convertAudioToBase64("../audios/intro.wav"),
        lipsync: await readJsonTranscript("../audios/intro.json"),
        facialExpression: "smile",
        animation: "idle",
      };
      res.send({ messages: [responseMessage] });
      return;
    }

    // Get model response
    const Response = await getModelResponse(userMessage, conversationHistory);

    // Process responses
    const messages = await Promise.all(
      Response.map(async (Message, index) => {
        const emotion = await getEmotion(Message.text);
        return {
          text: Message.text,
          // facialExpression: FACIAL_EXPRESSIONS[emotion] || "default",
          facialExpression:"angry",
          animation: ANIMATIONS[emotion] || "idle",
          audio: await generateSpeech(Message.text, index),
          lipsync: await lipSyncMessage(index),
        };
      })
    );
    console.log("messge : ",messages)

    res.send({ messages });
  } catch (error) {
    console.error("Error in chatHandler:", error);

    // Fallback response
    const fallbackMessage = {
      text: "Sorry I'm a dumbo!",
      audio: await convertAudioToBase64("../audios/dumbo.wav"),
      lipsync: await readJsonTranscript("../audios/dumbo.json"),
      facialExpression: Math.random() < 0.5 ? "funnyFace" : "default",
      animation: "dance",
    };
    res.send({ messages: [fallbackMessage] });
  }
};
