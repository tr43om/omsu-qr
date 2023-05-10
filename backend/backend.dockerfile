


# Use the official Node.js version 16.8 image as the base image
FROM node:16.8-stretch

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./


RUN yarn install  

# Copy the rest of the application files
COPY . .


CMD ["yarn", "start"]
