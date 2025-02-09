import { readJsonFile } from "../utils/fileUtils.js";
import { buildPrompt } from "../services/promptBuilder.js";
import { callHuggingFaceApi } from "../services/apiService.js";
import { queryEmbeddingStore } from "../services/embeddingService.js";

const CONFIG = {
  numRelevantDocs: 3,  // Adjust as needed
  historySize: 10      // Number of messages to retain in memory
};

// Manage conversation history with a list-based approach
const memory = [];

const manageMemory = (newMessage) => {
  if (memory.length >= CONFIG.historySize) {
    memory.shift();  // Remove the oldest message
  }
  memory.push(newMessage);  // Add the new message
};

export const getModelResponse = async (userMessage) => {
  try {
    console.log("Querying relevant document chunks...");
    const relevantChunks = await queryEmbeddingStore(userMessage, CONFIG.numRelevantDocs);
    console.log("Retrieved relevant context:", relevantChunks);

    if (relevantChunks.length === 0) {
      throw new Error("No relevant context found for the query.");
    }

    const context = relevantChunks.map((chunk) => chunk.content).join("\n");

    console.log("Combined context:", context);

    console.log("Reading JSON details...");
    const details = await readJsonFile();
    console.log("JSON details read successfully.");

    // Include memory as history
    const updatedHistory = [...memory];

    console.log("Building the prompt...");
    const fullPrompt = buildPrompt(details, updatedHistory, userMessage);
    console.log("Prompt built successfully:", fullPrompt);

    console.log("Calling the API with the prompt...");
    const response = await callHuggingFaceApi(fullPrompt);
    console.log("Model response received:", response);

    if (response.length > 0 && response[0].generated_text) {
      let responseText = response[0].generated_text
        .split("\n")
        .slice(-1)[0]
        .trim();
      console.log("Final response text:", responseText);

      // Update conversation memory
      manageMemory({ user: userMessage, bot: responseText });

      return [{ text: responseText.replace(/^\*\*.*?\*\*:\s*/, "") }];
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error in getModelResponse:", error);
    throw error;
  }
};

// #########################################################################################

// import { readJsonFile, loadContent } from "../utils/fileUtils.js";
// // import { readJsonFile } from "../utils/fileUtils.js";
// import { buildPrompt } from "../services/promptBuilder.js";
// import { callHuggingFaceApi } from "../services/apiService.js";

// export const getModelResponse = async (userMessage, history) => {
//   try {
//     const details = await readJsonFile();
//     const prompt = buildPrompt(details, history, userMessage);
//     const response = await callHuggingFaceApi(prompt);

//     console.log("Model response: ", response);

//     if (Array.isArray(response) && response[0]?.generated_text) {
//       let responseText = response[0].generated_text
//         // Remove excessive newlines and trim the text
//         .replace(/\n{2,}/g, '\n')  // Replace multiple newlines with a single one
//         .trim()
//         // Remove system instructions or any markdown-like headers (optional)
//         .replace(/^\*\*.*?\*\*:\s*/, "")  
//         .replace(/^\[SYSTEM\].*?\n/, "")  // Remove any system messages if present
//         .split("\n")  // Split by lines
//         .find(line => line.trim().length > 0);  // Get the first non-empty meaningful response

//       return [{ text: responseText || "I'm sorry, I didn't catch that. Could you clarify?" }];
//     } else {
//       throw new Error("Invalid response structure");
//     }
//   } catch (error) {
//     console.error("Error in getModelResponse:", error.message);
//     throw error;
//   }
// };


// #######################################################################################
