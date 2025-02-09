import fs from 'fs';
import path from 'path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-node';
import { loadPDFContent, chunkDocument } from '../utils/pdfUtils.js';

let model;
let vectorStore = new MemoryVectorStore();

const CONFIG = {
  chunkSize: 128,
  chunkOverlap: 20
};

const loadModel = async () => {
  if (!model) {
    model = await use.load();
    console.log("Universal Sentence Encoder loaded.");
  }
};

export const initIndex = async (pdfPath) => {
  try {
    const embeddingsFilePath = path.resolve('embeddings.json');

    if (fs.existsSync(embeddingsFilePath)) {
      console.log("Loading precomputed embeddings...");
      const savedEmbeddings = JSON.parse(fs.readFileSync(embeddingsFilePath));
      for (const item of savedEmbeddings) {
        await vectorStore.add(item.chunk, item.embedding);
      }
      return;
    }

    const pdfContent = await loadPDFContent(pdfPath);
    const combinedContent = pdfContent.map(page => page.pageContent).join("\n");
    const chunks = chunkDocument(combinedContent, CONFIG.chunkSize, CONFIG.chunkOverlap);

    await loadModel();
    const embeddings = [];
    for (const chunk of chunks) {
      const embedding = await model.embed(chunk);
      const embeddingArray = embedding.arraySync()[0];
      await vectorStore.add(chunk, embeddingArray);
      embeddings.push({ chunk, embedding: embeddingArray });
    }

    fs.writeFileSync(embeddingsFilePath, JSON.stringify(embeddings));
    console.log("Embeddings created and stored.");
  } catch (error) {
    console.error("Error in initIndex:", error);
    throw error;
  }
};
