import { createEmbedding } from './embeddingService.js';
import { loadContent, chunkDocument } from '../utils/fileUtils.js';

const CONFIG = {
  chunkSize: 100,  // Reduced to force more chunks
  chunkOverlap: 50,
};

export const initIndex = async (filePath) => {
  try {
    console.log("Loading file content...");
    const content = await loadContent(filePath);
    const combinedText = content.map(page => page.pageContent).join(" ");

    console.log("Splitting document into chunks...");
    const chunks = chunkDocument(combinedText, CONFIG.chunkSize, CONFIG.chunkOverlap);
    console.log(`Chunks created successfully. Number of chunks: ${chunks.length}`);

    console.log("Creating embeddings for document chunks using Hugging Face...");
    await createEmbedding(chunks);
    console.log("Indexing completed successfully.");
  } catch (error) {
    console.error("Error in initIndex:", error);
    throw error;
  }
};
