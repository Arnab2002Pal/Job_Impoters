# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start production server
CMD ["npm", "run", "start"]
