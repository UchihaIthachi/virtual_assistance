import axios from "axios";
import { config } from "../config/dotenvConfig.js";
const HF_API_TOKEN = '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';

export const getEmotion = async (text) => {
    const maxRetries = 5;
    const delay = 2000; // Delay in milliseconds
  
    try {
      const firstSentence = text.split(/[.]/)[0];
      console.log("First sentence:", firstSentence);
  
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await axios.post(
            "https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier",
            { inputs: firstSentence },
            {
              headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          console.log("API response:", response.data);
  
          if (
            response.data &&
            response.data.length > 0 &&
            response.data[0].length > 0 &&
            response.data[0][0].label
          ) {
            const emotionLabel = response.data[0][0].label.toLowerCase();
            console.log("Emotion label:", emotionLabel);
            return emotionLabel;
          } else {
            console.error("Unexpected API response format:", response.data);
            return "neutral";
          }
        } catch (error) {
          if (error.response && error.response.status === 503) {
            console.log(
              `Model loading, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
    // If max retries are exhausted
    return "neutral";
  } catch (error) {
    console.error("Error in getEmotion:", error.message);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
    return "neutral";
  }
};