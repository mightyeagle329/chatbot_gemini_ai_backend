# Use the official Node.js 14 image as the base image
FROM node:20

# Install pandoc
RUN apt-get update && apt-get install -y pandoc

RUN apt-get install -y imagemagick libmagick++-dev libmagic-dev && apt-get clean
ENV PATH=$PATH:~/opt/bin:~/opt/node/bin:/usr/lib/x86_64-linux-gnu/ImageMagick-6.8.9/bin-Q16

RUN apt-get install -y texlive

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