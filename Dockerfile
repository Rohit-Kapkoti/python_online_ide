# Use Node.js LTS base image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Expose backend port (change if you're using a different port)
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
