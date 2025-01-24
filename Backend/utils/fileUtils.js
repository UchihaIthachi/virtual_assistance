import { promises as fs } from "fs";
import path from "path"; // Import the path module
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJsonFile = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "details.json"), // Use path module to join paths
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading details:", error);
    throw error;
  }
};

export const convertAudioToBase64 = async (filePath) => {
  const data = await fs.readFile(filePath);
  return data.toString("base64");
};


export const readJsonTranscript = async (file) => {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  };