# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install necessary build tools and libraries
RUN apk add --no-cache \
    build-base \
    cmake \
    boost-dev \
    git \
    ffmpeg

# Clone and build Rhubarb from source
RUN git clone https://github.com/DanielSWolf/rhubarb-lip-sync.git /tmp/rhubarb-lip-sync && \
    cd /tmp/rhubarb-lip-sync && \
    sed -i '/^add_subdirectory(\"extras/d' CMakeLists.txt && \
    cmake -Wno-dev -DBoost_NO_BOOST_CMAKE=ON . && \
    make && \
    cp rhubarb /usr/local/bin/ && \
    rm -rf /tmp/rhubarb-lip-sync

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the appropriate binaries and set permissions
COPY --chmod=755 ffmpeg /usr/local/bin/

# Copy service-account.json to the working directory
COPY service-account.json /app/

# Expose the port your app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
