FROM node:18

# Set working directory
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend code and build it
COPY Frontend ./Frontend
RUN cd Frontend && npm install && npm run build

# Copy backend code
COPY backend ./backend

# Expose port
EXPOSE 3000

# Start the backend server
CMD ["node", "backend/index.js"]
