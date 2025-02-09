import { initIndex } from "./services/initIndex.js";
import { startServer } from "./server.js";

// Initialize the index once at server startup
const pdfPath = '../simple_resume.txt';
initIndex(pdfPath)
  .then(() => {
    console.log("Indexing completed. Starting the server...");
    startServer();  // Call function to start the server after indexing
  })
  .catch(err => {
    console.error("Error during index initialization:", err);
    process.exit(1);  // Exit if indexing fails
  });
