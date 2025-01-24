import axios from "axios";
import { readJsonFile } from "../utils/fileUtils.js";

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_API_TOKEN = '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';

export const getModelResponse = async (userMessage, history) => {
    const details = await readJsonFile();
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
  
    const headers = {
      Authorization: `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json",
    };
  
    const body = JSON.stringify({
      inputs: personalizedInstructions.replace("[QUESTION]", userMessage),
      parameters: {
        max_new_tokens: 300,
      },
    });
  
    try {
      const response = await axios.post(HF_API_URL, body, { headers });
      console.log("API response:", response.data);
  
      if (response.data.length > 0 && response.data[0].generated_text) {
        let responseText = response.data[0].generated_text
          .split("\n")
          .slice(-1)[0]
          .trim();
  
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