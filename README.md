# Reconext Intranet: Workplace Efficiency

Reconext Intranet leverages a unified technological ecosystem, seamlessly integrating TypeScript with Node.js for backend operations and Vue.js for frontend interfaces. This cohesive approach fosters synergy between backend and frontend development, streamlining communication and enhancing collaboration. By adopting modern technologies and libraries like Vuetify for UI components, Vue Router for navigation, Axios for HTTP requests, and Pinia for state management, Reconext Intranet ensures a robust and efficient platform, delivering an intuitive user experience and empowering organizational productivity.

## Table of Contents

- [Installation](#installation)
- [Development](#development)

### Installation

#### Server requirements

    1. Ensure that your server meets the following requirements:

        - Docker Engine with Docker Compose or Docker Desktop installed: Docker provides containerization for seamless deployment.

        - Git installed: Git is necessary for cloning the project repository.

        - Node.js installed: Node.js is required for running the project's backend and frontend.

#### Pre-run Steps

    1. Clone the project repository by running the following command in your desired server directory:

        - git clone https://github.com/MaciejZab/node-vue-postgres.git

    2. Adjust Settings with toAdjust.env file:

        Navigate to the project directory and rename 'toAdjust.env' file to '.env', then configure settings according to your requirements.

    3. Install Dependencies:

        Run the following command in both the /vue and /node directories to install project dependencies:

        - npm install

    4. Build Vue.js and Node.js Applications:

        After installing dependencies, build the Vue.js frontend and Node.js backend by running following command in both the /vue and /node directories:

        - npm run build

#### Run Docker Containers

    1. Build the Docker containers by running:

        - docker-compose build

    2. Start the Docker containers in detached mode (background) by running:

        - docker-compose up -d

    Or simply:

        - docker-compose up -d --build

### Development

    To facilitate seamless development, it's important to note that Vue and Node applications behave differently in terms of reloading changes during development.

    1. Modify the source code within the /node and/or /vue directories to implement desired changes.

    2. Rebuilding the Node and/or Vue applications involves compiling the source code into JavaScript. To achieve this, run the following command in the /vue and/or /node directory:

        - npm run build

    3. At this point, changes made to the Vue application are reflected in the browser.

    4. Unlike the Vue application, the Node application requires one additional step. To reflect modifications in the Node application, it's necessary to rebuild the container for this service. To achieve this, navigate to the root directory and run the following command:

        - docker-compose up -d --build node

    Once the Node service is rebuilt, the changes will be reflected.
