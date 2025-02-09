import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { config } from "../config/dotenvConfig.js";  // Hugging Face API token and URL
import axios from "axios";

let vectorStore;
let vectorStorePopulated = false;  // Global flag to check if vectors have been added

// Initialize the vector store correctly
const initializeVectorStore = () => {
  if (!vectorStore) {
    vectorStore = new MemoryVectorStore();
  }
};

// Function to create embeddings and store them in memory using addVectors
export const createEmbedding = async (chunks) => {
  initializeVectorStore();  // Ensure vectorStore is initialized

  const documents = [];
  const vectors = [];  // Store embeddings separately

  for (const chunk of chunks) {
    console.log("Generating embedding for chunk:", chunk.substring(0, 50));
    const embedding = await fetchEmbeddingFromHuggingFace(chunk);
    
    documents.push({ pageContent: chunk });  // Store the chunk of text
    vectors.push(embedding);  // Store corresponding embedding
  }

  if (vectors.length > 0) {
    // Directly store the embeddings using addVectors
    await vectorStore.addVectors(vectors, documents);
    vectorStorePopulated = true;  // Mark the vector store as populated
    console.log("Embeddings created and stored successfully.");
  } else {
    console.error("No embeddings were created. Check the document content or embedding process.");
  }
};

// Function to fetch embeddings from the Hugging Face API
const fetchEmbeddingFromHuggingFace = async (text, retries = 5) => {
    let attempt = 0;
  
    while (attempt < retries) {
      try {
        const response = await axios.post(
          `${config.hfApiUrl2}?wait_for_model=true`,
          {
            inputs: {
              source_sentence: text,
              sentences: [text],  // For embedding purposes, use the same sentence
            },
          },
          {
            headers: {
              Authorization: `Bearer ${config.hfApiToken}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log("Done.....!");
          return response.data[0];  // Return the first embedding vector
        } else {
          console.warn("Unexpected response format from Hugging Face:", response.data);
          throw new Error("Invalid response from Hugging Face.");
        }
      } catch (error) {
        console.error(
          `Attempt ${attempt + 1} failed:`,
          error.response ? error.response.data : error.message
        );
        if (attempt === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));  // Exponential backoff
        attempt++;
      }
    }
  };
  

// Function to query the vector store and find relevant document chunks
export const queryEmbeddingStore = async (query, numRelevantDocs) => {
    try {
      initializeVectorStore();  // Ensure vector store is initialized
  
      // Check if the vector store has embeddings
      if (!vectorStorePopulated) {
        throw new Error("Vector store is empty. Ensure embeddings have been added.");
      }
  
      // Fetch the embedding for the user's query
      const queryEmbedding = await fetchEmbeddingFromHuggingFace(query);
      console.log("Query embedding generated successfully.");
  
      // Perform similarity search directly using the embedding vector
      const results = await vectorStore.similaritySearchVectorWithScore(queryEmbedding, numRelevantDocs);
      console.log("Similarity search results:", results);
  
      if (results.length === 0) {
        console.warn("No relevant documents found for the query.");
        return [];
      }
      
      return results.map(([result, score]) => ({
        content: result.pageContent,
        score: score,
      }));
    } catch (error) {
      console.error("Error in queryEmbeddingStore:", error);
      throw error;
    }
  };
  
