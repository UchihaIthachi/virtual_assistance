import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import mainRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./config/swaggerConfig.js";

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet()); // Secure HTTP headers

// Performance Middleware
app.use(compression()); // Compress HTTP responses

// Static File Caching
app.use(express.static("public", { maxAge: "1d" })); // Cache static files

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(mainRouter);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling middleware
app.use(errorHandler);

export default app;
