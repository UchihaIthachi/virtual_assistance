import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  hfApiKey: process.env.HF_API_TOKEN,
  elevenLabsKey: process.env.ELEVEN_LABS_API_KEY,
};
