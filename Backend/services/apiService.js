import axios from "axios";
import { config } from "../config/dotenvConfig.js";

export const callHuggingFaceApi = async (prompt) => {
  const headers = {
    Authorization: `Bearer ${config.hfApiToken}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    inputs: prompt,
    parameters: {
      max_new_tokens: 300,
    },
  });

  try {
    const response = await axios.post(config.hfApiUrl, body, { headers });
    return response.data;
  } catch (error) {
    console.error(
      "Error in callHuggingFaceApi:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
