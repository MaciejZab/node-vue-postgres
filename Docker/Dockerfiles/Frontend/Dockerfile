# 1.

# Use an official Node.js image as the base image
FROM node:18 AS build-stage

# Set the working directory for any subsequent RUN, CMD, ENTRYPOINT, COPY, and ADD instructions in the Dockerfile.
WORKDIR /usr/src/app

# Copy files as a non-root user.
RUN chown node:node ./
USER node

# Production mode
ENV NODE_ENV production

# Copy package.json and package-lock.json to install dependencies
COPY ./Vue/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY ./Vue .

# Build the Vue.js application
RUN npm run build

# 2.

# Use Nginx to serve the built Vue.js application
FROM nginx:1.25

# Create a dedicated user for Nginx
RUN useradd -r nginx

# Set ownership of necessary directories
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copy the built Vue.js application to the Nginx web server directory
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]