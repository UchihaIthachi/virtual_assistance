import { exec } from "child_process"; // To execute shell commands
import path from "path"; // To work with file paths
import { promises as fs } from "fs"; // For asynchronous file operations
import fsSync from "fs"; // For synchronous file operations
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import os from "os"; // To detect the operating system

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the base directory to the root folder of the project
const baseDir = path.resolve(__dirname, "..");

// Determine OS and set the path to ffmpeg and rhubarb executable accordingly
const isWindows = os.platform() === "win32";
const ffmpegPath = isWindows
  ? path.join(baseDir, "bin", "ffmpeg.exe")
  : path.join(baseDir, "ffmpeg", "ffmpeg"); // Default global path on Unix-like systems
const rhubarbPath = isWindows
  ? path.join(baseDir, "bin", "rhubarb.exe")
  : path.join(baseDir, "rhubarb", "rhubarb");

// Set the path for ffmpeg in fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to ensure the ffmpeg binary has executable permissions
// const ensureExecutable = async (filePath) => {
//   try {
//     console.log(`Checking executable permissions for: ${filePath}`);
//     await execCommand(`chmod +x ${filePath}`);
//     console.log(`Ensured ${filePath} has executable permissions.`);
//   } catch (error) {
//     console.error(`Failed to set executable permissions for ${filePath}:`, error.message);
//     throw error;
//   }
// };

// Lip-sync message function
export const lipSyncMessage = async (index) => {
  const mp3FileName = path.join(__dirname, `../audios/audio_${index}.mp3`);
  const wavFileName = path.join(__dirname, `../audios/audio_${index}.wav`);
  const jsonFileName = path.join(__dirname, `../audios/audio_${index}.json`);

  try {
    console.log("========== Lip Sync Process Start ==========");
    console.log("Paths:");
    console.log("  MP3 File:", mp3FileName);
    console.log("  WAV File:", wavFileName);
    console.log("  JSON Output File:", jsonFileName);
    console.log("  Rhubarb Path:", rhubarbPath);
    console.log("  FFmpeg Path:", ffmpegPath);

    // Ensure FFmpeg is executable
    // await ensureExecutable(ffmpegPath);

    // Ensure Rhubarb is executable
    if (!fsSync.existsSync(rhubarbPath)) {
      console.error("Rhubarb not found at the specified path.");
      throw new Error(`Rhubarb not found at ${rhubarbPath}. Please ensure it is installed and accessible.`);
    }
    // await ensureExecutable(rhubarbPath);

    // Ensure MP3 file exists
    if (!fsSync.existsSync(mp3FileName)) {
      console.error("MP3 file not found:", mp3FileName);
      throw new Error(`Audio file not found: ${mp3FileName}`);
    }

    console.log("Converting MP3 to WAV...");
    // Convert MP3 to WAV
    await execCommand(`${ffmpegPath} -y -i ${mp3FileName} ${wavFileName}`);
    console.log("MP3 to WAV conversion complete.");

    console.log("Running Rhubarb for lip-sync...");
    // Run Rhubarb for lip-sync
    await execCommand(`${rhubarbPath} -f json -o ${jsonFileName} ${wavFileName} -r phonetic`);
    console.log("Rhubarb lip-sync process complete.");

    console.log("Reading JSON output...");
    // Read and return the JSON transcript
    const transcript = await readJsonTranscript(jsonFileName);
    console.log("JSON output successfully read:", transcript);

    console.log("========== Lip Sync Process Complete ==========");
    return transcript;
  } catch (error) {
    console.error("Error in lipSyncMessage:", error.message);
    throw error;
  }
};

// Function to execute shell commands
const execCommand = (cmd) => {
  console.log("Executing command:", cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`Command stderr: ${stderr}`);
      }
      console.log(`Command stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

// Function to read JSON transcripts
const readJsonTranscript = async (file) => {
  console.log("Reading JSON file:", file);
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};
