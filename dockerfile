# Use the official Node.js 18 image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source
COPY . .

# Environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]