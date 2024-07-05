const request = require("supertest");
const app = require("../index"); // Adjust the path to your app file
const axios = require("axios");
const voice = require("elevenlabs-node");
const fs = require("fs").promises;

jest.mock("axios");
jest.mock("elevenlabs-node");
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe("POST /chat", () => {
  it("should handle error from Eleven Labs API and return fallback response", async () => {
    // Mock Rasa response
    axios.post.mockResolvedValue({
      data: [{ text: "Hello guys" }],
    });

    // Mock Eleven Labs API to throw an error
    voice.textToSpeech.mockImplementation(() => {
      throw new Error("Eleven Labs API error");
    });

    // Mock file reading for fallback message
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.endsWith("dumbo.wav")) {
        return Promise.resolve("dummy wav data");
      }
      if (filePath.endsWith("dumbo.json")) {
        return Promise.resolve(
          JSON.stringify({ lipsync: "dummy lipsync data" })
        );
      }
      return Promise.reject("File not found");
    });

    const res = await request(app)
      .post("/chat")
      .send({ message: "Hello guys" });

    expect(res.status).toBe(200);
    expect(res.body.messages).toEqual([
      {
        text: "Sorry I'm a dumbo!",
        audio: expect.any(String), // base64 encoded string
        lipsync: { lipsync: "dummy lipsync data" },
        facialExpression: expect.stringMatching(/funnyFace|default/),
        animation: "dance",
      },
    ]);
  });
});
