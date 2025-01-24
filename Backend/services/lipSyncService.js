import { exec } from "child_process"; // To execute shell commands
import path from "path"; // To work with file paths
import { promises as fs } from "fs"; // For asynchronous file operations
import fsSync from "fs"; // For synchronous file operations
import ffmpeg from "fluent-ffmpeg"; 
// import path from "path"; // Import the path module
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// // Determine OS and set the path to ffmpeg and rhubarb executable accordingly
// const isWindows = os.platform() === "win32";
// // const ffmpegPath = isWindows
// //   ? path.join(__dirname, "ffmpeg-win", "bin", "ffmpeg.exe")
// //   : path.join(__dirname, "ffmpeg", "bin", "ffmpeg");
// // const rhubarbPath = isWindows
// //   ? path.join(__dirname, "rhubarb-win", "rhubarb.exe")
// //   : path.join(__dirname, "rhubarb");
  const rhubarbPath = "/home/harshana-kasara/Desktop/virtual_assistance/Backend/rhubarb/rhubarb";


// Set the path to ffmpeg executable
// ffmpeg.setFfmpegPath(ffmpegPath);
const ffmpegPath = "/usr/bin/ffmpeg"; // Update with your global path
ffmpeg.setFfmpegPath(ffmpegPath);

// Lip-sync message function
export const lipSyncMessage = async (index) => {
    const mp3FileName = path.join(__dirname, `../audios/audio_${index}.mp3`);
    const wavFileName = path.join(__dirname, `../audios/audio_${index}.wav`);
  
    try {
      console.log("Converting MP3 to WAV:", mp3FileName, wavFileName);
  
      // Ensure Rhubarb is executable
      if (!fsSync.existsSync(rhubarbPath)) {
        throw new Error(`Rhubarb not found at ${rhubarbPath}. Please ensure it is installed and accessible.`);
      }
  
      // Convert MP3 to WAV
      await execCommand(`${ffmpegPath} -y -i ${mp3FileName} ${wavFileName}`);
  
      // Run Rhubarb for lip-sync
      await execCommand(
        `${rhubarbPath} -f json -o audios/audio_${index}.json ${wavFileName} -r phonetic`
      );
  
      // Read and return the JSON transcript
      return await readJsonTranscript(`audios/audio_${index}.json`);
    } catch (error) {
      console.error("Error in lipSyncMessage:", error.message);
      throw error;
    }
  };
  
  // Function to execute shell commands
  const execCommand = (cmd) => {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Exec error: ${error}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
        }
        console.log(`Stdout: ${stdout}`);
        resolve(stdout);
      });
    });
  };

  const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};