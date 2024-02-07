# install heavy node:<version>
FROM node:18

# Set the working directory for any subsequent RUN, CMD, ENTRYPOINT, COPY, and ADD instructions in the Dockerfile.
WORKDIR /usr/src/app

# Copy files as a non-root user.
RUN chown node:node ./
USER node

# Production mode
ENV NODE_ENV production

# Copy package.json and package-lock.json to install dependencies
COPY ./Node/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY ./Node .

# Execute NodeJS (not NPM script) to handle SIGTERM and SIGINT signals.
CMD ["node", "./src/index.js"]

