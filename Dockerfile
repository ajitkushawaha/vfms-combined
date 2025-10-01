FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server file
COPY server.js ./

# Copy React build files
COPY build/ ./build/

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
