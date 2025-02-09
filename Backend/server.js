import app from "./app.js";
import { config } from "./config/dotenvConfig.js";

export function startServer() {
  const PORT = config.port || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
