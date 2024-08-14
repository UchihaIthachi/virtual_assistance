# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the appropriate binaries based on the OS
RUN if [ "$(uname -m)" = "x86_64" ]; then \
      cp -r ./ffmpeg /usr/local/bin/ && \
      cp -r ./rhubarb /usr/local/bin/; \
    else \
      cp -r ./ffmpeg-win /usr/local/bin/ && \
      cp -r ./rhubarb-win /usr/local/bin/; \
    fi

# Expose the port your app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
