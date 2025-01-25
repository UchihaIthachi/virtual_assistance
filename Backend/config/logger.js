import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to console for general info
    new winston.transports.Console(),

    // Log errors to a file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),

    // Log all info-level logs to a file
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// In development, log to the console with a simple format
if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
