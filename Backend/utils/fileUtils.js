import { promises as fs } from "fs";
import path from "path"; // Import the path module
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import mammoth from "mammoth";

import exp from "constants";

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

  export const loadContent = async (filePath) => {
    try {
      const resolvedPath = path.resolve(__dirname, filePath);
      console.log("Resolved File Path:", resolvedPath);
  
      const fileExtension = path.extname(resolvedPath).toLowerCase();
      let content = "";
  
      switch (fileExtension) {
        case ".pdf":
          content = await loadPDF(resolvedPath);
          break;
        case ".txt":
          content = await loadTXT(resolvedPath);
          break;
        case ".doc":
        case ".docx":
          content = await loadDOCX(resolvedPath);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }
  
      // Clean and preprocess the content
      const cleanedText = cleanTextContent(content);
      return [{ pageContent: cleanedText, metadata: { loc: "Content" } }];
    } catch (error) {
      console.error("Error loading content:", error.message);
      throw error;
    }
  };
  
  // Load PDF content using pdf-parse
  const loadPDF = async (pdfPath) => {
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdf(pdfBuffer);
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error("PDF content is empty or could not be extracted.");
    }
    return pdfData.text;
  };
  
  // Load TXT content
  const loadTXT = async (txtPath) => {
    const txtData = await fs.readFile(txtPath, "utf8");
    if (!txtData || txtData.trim().length === 0) {
      throw new Error("TXT file is empty or could not be read.");
    }
    return txtData;
  };
  
  // Load DOC/DOCX content using mammoth
  const loadDOCX = async (docxPath) => {
    const { value } = await mammoth.extractRawText({ path: docxPath });
    if (!value || value.trim().length === 0) {
      throw new Error("DOC/DOCX content is empty or could not be extracted.");
    }
    return value;
  };
  
  // Clean and preprocess the content
  const cleanTextContent = (text) => {
    return text
      .replace(/[\r\n]+/g, " ")  // Remove line breaks
      .replace(/[^\w\s.,!?]/g, "")  // Remove special characters
      .replace(/\s+/g, " ")  // Normalize spaces
      .replace(/ToolsUsed\s*[:]?/gi, "")  // Remove "ToolsUsed"
      .replace(/\d{5,}/g, "")  // Remove long numbers (e.g., phone numbers)
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "")  // Remove emails
      .replace(/http\S+/g, "")  // Remove URLs
      .trim();
  };
  
  
  // Helper function to split the document into overlapping chunks
  export const chunkDocument = (text, chunkSize, overlap) => {
    const chunks = [];
    const sentences = text.match(/[^.!?]+[.!?]/g) || [text];  // Split by sentences
  
    let currentChunk = "";
  
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= chunkSize) {
        currentChunk += sentence.trim() + " ";
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = sentence.trim() + " ";
      }
    }
  
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
    }
  
    return chunks.filter(chunk => chunk.length <= 512);
  };
  