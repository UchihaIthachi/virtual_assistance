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

# Copy the appropriate binaries based on the OS and set permissions
COPY --chmod=755 ffmpeg /usr/local/bin/
COPY --chmod=755 rhubarb /usr/local/bin/

# Copy service-account.json to the working directory
COPY service-account.json /app/

# Expose the port your app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
