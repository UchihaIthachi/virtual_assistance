import axios from "axios";
import fs from "fs/promises";

const loadMockData = async () => {
  const data = await fs.readFile("mock_data.json", "utf8");
  return JSON.parse(data);
};

const testChatEndpoint = async () => {
  const mockData = await loadMockData();
  const endpoint = "http://localhost:3000/chat";

  for (const test of mockData) {
    try {
      const response = await axios.post(endpoint, {
        message: test.userMessage,
      });

      const { messages } = response.data;
      const receivedMessage = messages[0];

      console.log(`User Message: ${test.userMessage}`);
      console.log(`Expected Emotion: ${test.expectedEmotion}`);
      console.log(`Received Emotion: ${receivedMessage.facialExpression}`);
      console.log(`Expected Animation: ${test.expectedAnimation}`);
      console.log(`Received Animation: ${receivedMessage.animation}`);
      console.log(
        `Test Passed: ${
          test.expectedEmotion === receivedMessage.facialExpression &&
          test.expectedAnimation === receivedMessage.animation
        }`
      );
      console.log("--------------------");
    } catch (error) {
      console.error(`Error testing message "${test.userMessage}":`, error);
    }
  }
};

testChatEndpoint();
