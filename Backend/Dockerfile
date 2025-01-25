# Use a lightweight Node.js base image
FROM node:18-alpine

# Install required packages for FFmpeg and Rhubarb
RUN apk add --no-cache ffmpeg bash

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure Rhubarb is executable
RUN chmod +x ./rhubarb/rhubarb

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
