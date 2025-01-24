import axios from "axios";
import { promises as fs } from "fs";
import { convertAudioToBase64 } from "../utils/fileUtils.js";
import { config } from "../config/dotenvConfig.js";

// const elevenLabsApiKey = config.elevenLabsKey;
const elevenLabsApiKey = "sk_49b7c9ecb08e3c1f579c6d2d95bf05090d0ed4f49a7d6013"
const voiceID = "pNInz6obpgDQGcFmaJgB"; // Replace with your voice ID

export const generateSpeech = async (textInput, index) => {
    const fileName = `audios/audio_${index}.mp3`;
  
    try {
      console.log("Sending text to Eleven Labs API:", textInput);
  
      const headers = {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsApiKey,
      };
  
      const body = {
        text: textInput,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.9,
        },
      };
  
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`,
        body,
        { headers, responseType: "arraybuffer" } // Ensures we get binary data
      );
  
      if (!response.data) {
        console.error("Empty API response:", response);
        throw new Error("Empty API response");
      }
  
      console.log("API Response received, writing to file...");
      await fs.writeFile(fileName, response.data, "binary");
  
      return await convertAudioToBase64(fileName);
    } catch (error) {
      console.error("Error in generateSpeech:", error.message);
      throw error;
    }
  };
  
// Initialize the Google Cloud Text-to-Speech client
// const client = new textToSpeech.TextToSpeechClient();

  
  // const generateSpeech = async (textInput, index) => {
  //   const fileName = `audios/audio_${index}.mp3`;
  
  //   try {
  //     // // Construct the request
  //     // const request = {
  //     //   input: { text: textInput },
  //     //   voice: { languageCode: "en-US", ssmlGender: "MALE" }, // You can choose the voice gender and language code
  //     //   audioConfig: { audioEncoding: "MP3" },
  //     // };
  
  //     // // Perform the Text-to-Speech request
  //     // const [response] = await client.synthesizeSpeech(request);
  //     const response = await voice.textToSpeech(elevenLabsApiKey, voiceID, textInput, {
  //       stability: 0.75,
  //       similarity_boost: 0.9,
  //     });
  
  //     // Write the binary audio content to a file
  //     await fs.writeFile(fileName, response.audioContent, "binary");
  
  //     // Convert the audio file to Base64 and return it
  //     return await audioFileToBase64(fileName);
  //   } catch (error) {
  //     console.log("Error in generateSpeech:", error);
  //     throw error;
  //   }
  // };