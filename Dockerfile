# Use the official lightweight Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (optional, for debugging)
EXPOSE 3000

# Command to run the application
CMD ["ts-node-dev", "src/server.ts"]

