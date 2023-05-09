


# Use the official Node.js version 16.8 image as the base image
FROM node:16.8-stretch

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package*.json ./

# Install production dependencies only
RUN yarn install

# Copy the rest of the application files
COPY . .





CMD ["yarn", "dev"]
