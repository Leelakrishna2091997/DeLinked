# delinked-client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Fix for SWC helpers issue
RUN npm install --save-dev @swc/helpers@0.4.14

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]