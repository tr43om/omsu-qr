


# Use the official Node.js version 16.8 image as the base image
FROM node:16.8-stretch

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile --network-timeout 100000

# Copy the rest of the application files
COPY . .

# Build the Next.js application for production
RUN yarn build

# Expose the port that the Next.js application will run on
EXPOSE 3001

# Start the Next.js application in production mode
CMD ["yarn", "start"]
