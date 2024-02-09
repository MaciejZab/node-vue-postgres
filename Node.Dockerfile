FROM node:18

RUN chown node:node /usr/src/app
USER node

ENV NODE_ENV production

RUN mkdir -p /usr/src/app/Node

WORKDIR /usr/src/app/Node

# Copy package.json and package-lock.json to install dependencies
COPY ../../Node/package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Execute NodeJS (not NPM script) to handle SIGTERM and SIGINT signals.
CMD ["node", "./src/index.js"]

