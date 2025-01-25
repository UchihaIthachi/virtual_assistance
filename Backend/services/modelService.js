import { readJsonFile } from "../utils/fileUtils.js";
import { buildPrompt } from "../services/promptBuilder.js";
import { callHuggingFaceApi } from "../services/apiService.js";

export const getModelResponse = async (userMessage, history) => {
  try {
    const details = await readJsonFile();
    const prompt = buildPrompt(details, history, userMessage);
    const response = await callHuggingFaceApi(prompt);

    if (response.length > 0 && response[0].generated_text) {
      let responseText = response[0].generated_text
        .split("\n")
        .slice(-1)[0]
        .trim();

      return [{ text: responseText.replace(/^\*\*.*?\*\*:\s*/, "") }];
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error in getModelResponse:", error.message);
    throw error;
  }
};
