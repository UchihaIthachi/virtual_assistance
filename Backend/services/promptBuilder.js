import { systemInstructions } from "../prompts/systemInstructions.js";
import { technicalPrompt } from "../prompts/technicalPrompt.js";
import { formatConversation } from "../utils/promptUtils.js";

export const buildPrompt = (details, history, userMessage, promptType = "default") => {
  const formattedConversation = formatConversation(history);

  // Select the appropriate prompt
  const selectedPrompt =
    promptType === "technical"
      ? technicalPrompt
      : systemInstructions; // Default to systemInstructions

  return `
    ${selectedPrompt
      .replace("{Name}", details.Name)
      .replace("{Role}", details.Role)
      .replace("{Technology}", details.Technology || "various technologies")}

    Additional Context:
    - **Birthday**: ${details.Birthday}
    - **Occupation**: ${details.Occupation}
    - **Hobbies**: ${details.Hobbies.join(", ")}
    - **Favorite Language**: ${details.Favorite_language}

    Recent conversation:
    ${formattedConversation}

    Here is the user's query: ${userMessage}
  `;
};
