# Use the official Node.js 14 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that your application listens on (if applicable)
EXPOSE 8080

# Set the command to run your application
CMD ["node", "dist/main"]