import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);
const baseDir = path.resolve(__dirname);
const ffmpegPath = path.join(baseDir, "ffmpeg", "ffmpeg");
const rhubarbPath = path.join(baseDir, "rhubarb", "rhubarb");

const ensureExecutable = async (filePath) => {
  try {
    console.log(`Setting executable permissions for: ${filePath}`);
    await execPromise(`chmod +x ${filePath}`);
    console.log(`Executable permissions set for: ${filePath}`);
  } catch (error) {
    console.error(`Failed to set executable permissions for ${filePath}:`, error.message);
  }
};

(async () => {
  try {
    console.log("Ensuring executables have the correct permissions...");
    await ensureExecutable(ffmpegPath);
    await ensureExecutable(rhubarbPath);
    console.log("Permissions set successfully.");
  } catch (error) {
    console.error("Error setting permissions:", error.message);
    process.exit(1);
  }
})();
