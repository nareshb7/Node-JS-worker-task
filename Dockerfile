# Use the official lightweight Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app


# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install -g typescript ts-node

# Install dependencies
RUN npm install && npm install -g nodemon
RUN npm install express

# Copy the rest of the application code
COPY . .

# Expose port (optional, for debugging)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

