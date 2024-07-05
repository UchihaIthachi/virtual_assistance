# Virtual Assistant with 3D Animation and AI Chatbot

This project implements a virtual assistant with 3D animation capabilities and an AI chatbot powered by Rasa. The assistant can process text input from users, generate audio responses using Eleven Labs for text-to-speech conversion, synchronize lip movements and facial expressions using Rhubarb, and animate responses using ThreeJS.

## Features

- **3D Animation**: Utilizes ThreeJS to create immersive 3D animations for interactive user experiences.
- **Natural Language Processing**: Integrates Rasa for understanding and generating responses based on user input.
- **Text-to-Speech**: Converts generated text responses into audio using Eleven Labs.
- **Lip Sync and Facial Expressions**: Achieves realistic lip sync and facial expressions using Rhubarb.
- **Backend Processing**: Node.js backend processes user input, interfaces with Rasa, manages audio conversion, and synchronization processes.
- **Communication Flow**: Frontend sends user queries to the backend, receives processed responses (text, audio, animation), and renders them for user interaction.

## Technologies Used

- **Frontend**: React with ThreeJS
- **Backend**: Node.js
- **Natural Language Processing**: Rasa
- **Text-to-Speech**: Eleven Labs
- **Audio Conversion**: FFmpeg
- **Lip Sync**: Rhubarb

## Setup Instructions

1. **Clone Repository**:

   ```bash
   git clone <repository_url>
   cd virtual-assistant
   ```

2. **Install Dependencies**:

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure Environment Variables**:

   - Set up necessary environment variables for Rasa, Eleven Labs, and any other API keys or configurations required.

4. **Start Development Servers**:

   ```bash
   # Start frontend server (in the frontend directory)
   npm start

   # Start backend server (in the backend directory)
   npm start
   ```

5. **Access the Application**:
   - Open your browser and go to `http://localhost:5173` to view the frontend application.
   - Backend server runs on `http://localhost:8000`.

## Usage

- **Development Mode**: Use `npm start` in both frontend and backend directories to run the development servers concurrently.
- **Production Deployment**: Configure your servers and build processes accordingly for deploying the frontend and backend to production environments.

## Makefile Commands

Ensure you have Make installed (`sudo apt-get install make` on Linux).

- **Install Dependencies**: `make install`
- **Start Development Servers**: `make start`
- **Start Frontend Server**: `make frontend`
- **Start Backend Server**: `make backend`
- **Clean Dependencies**: `make clean`
- **Help**: `make help`

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
