# Reconext Intranet: Workplace Efficiency

Reconext Intranet leverages a unified technological ecosystem, seamlessly integrating TypeScript with Node.js for backend operations and Vue.js for frontend interfaces. This cohesive approach fosters synergy between backend and frontend development, streamlining communication and enhancing collaboration. By adopting modern technologies and libraries like Vuetify for UI components, Vue Router for navigation, Axios for HTTP requests, and Pinia for state management, Reconext Intranet ensures a robust and efficient platform, delivering an intuitive user experience and empowering organizational productivity.

## Table of Contents

- [Installation](#installation)
  - [Server Requirements](#server-requirements)
  - [Pre-run Steps](#pre-run-steps)
  - [Run Docker Containers](#run-docker-containers)
- [Development](#development)
- [API](#api)

## Installation

### Server Requirements

1. **Ensure that your server meets the following requirements:**
   - Docker Engine with Docker Compose or Docker Desktop installed: Docker provides containerization for seamless deployment.
   - Git installed: Git is necessary for cloning the project repository.
   - Node.js installed: Node.js is required for running the project's backend and frontend.

### Pre-run Steps

1. Clone the project repository by running the following command in your desired server directory:

   ```bash
   git clone https://github.com/MaciejZab/node-vue-postgres.git
   ```

2. Navigate to the project directory and rename 'toAdjust.env' file to '.env', then configure settings according to your requirements.

3. Install Dependencies: Run the following command in both the `/vue` and `/node` directories to install project dependencies:

   ```bash
   npm install
   ```

4. After installing dependencies, build the Vue.js frontend and Node.js backend by running the following command in both the `/vue` and `/node` directories:

   ```bash
   npm run build
   ```

### Run Docker Containers

1. Build the Docker containers by running in the project's root directory:

   ```bash
   docker-compose up -d --build
   ```

## Development

To facilitate seamless development, it's important to note that Vue and Node applications behave differently in terms of reloading changes during development.

1. First modify the source code within the `/node` and/or `/vue` directory.
2. Rebuild Node and/or Vue application source code into JavaScript by running the following command in the `/vue` and/or `/node` directory:

   ```bash
   npm run build
   ```

3. At this point, changes made to the Vue application are reflected in the browser.

4. Unlike the Vue application, the Node application requires one additional step. To reflect modifications in the Node application, it's necessary to rebuild the container for this service. To achieve this, navigate to the root directory and run the following command:

   ```bash
   docker-compose up -d --build node
   ```

5. Once the Node service is rebuilt, changes are reflected.

## API

To access exposed endpoints, you need to include an API key in the query parameters of your request. Here's how you can use the API key query parameter:

- **Parameter Name:** `api-key`
- **Example:** `http://your-domain.com/api/endpoint?api-key=your-api-key`
