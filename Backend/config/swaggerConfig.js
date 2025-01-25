import swaggerJsdoc from "swagger-jsdoc";
import * as glob from "glob";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Virtual Assistance API",
      version: "1.0.0",
      description: "API documentation for Virtual Assistance Backend",
    },
  },
  apis: ["./routes/*.js"], // Relative path to route files
};

// Log which files are matched by the `apis` pattern
// const matchedFiles = glob.sync("../routes/*.js");
// console.log("Matched files for Swagger:", matchedFiles);

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Log the generated Swagger specification
// console.log("Generated Swagger Docs:", JSON.stringify(swaggerDocs, null, 2));

export default swaggerDocs;
