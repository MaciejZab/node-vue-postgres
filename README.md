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

    2. Adjust Settings in .env File:

        Navigate to the project directory and configure settings in the .env file according to your environment requirements.

    3. Install Dependencies:

        Run the following commands in both the /vue and /node directories to install project dependencies:

        - npm install

    4. Build Vue.js and Node.js Applications:

        After installing dependencies, build the Vue.js frontend and Node.js backend by running:

        - npm run build

#### Run Docker Containers

    1. Build Docker Containers:

        From the root directory of the project, build Docker containers using:

        - docker-compose build

    2. Start Docker Containers:

        Once the containers are built, start the Docker containers in detached mode (background) by running:

        - docker-compose up -d

    Following these steps will properly set up and deploy the Reconext Intranet application on your server environment. Adjust settings and configurations as needed for your specific use case.

### Development

    To facilitate seamless development, the local host volumes /vue/dist and /node/dist are connected with the corresponding containers. However, to reflect changes made during development, developers need to rebuild the /node and /vue applications.

    1. Make Changes:

        Modify the source code within the /node and /vue directories to implement desired changes.

        Build Node.js and Vue.js Applications:

        - npm run build

    2. After making changes, rebuild the Node.js backend and Vue.js frontend applications using:

        - npm run build

        Optionally run the following command in /vue to see changes immediately without the need to rebuild the application on every change manually:

        - npm run dev

    Once the applications are rebuilt, the changes will automatically be reflected in the connected containers due to the volume mapping with /vue/dist and /node/dist.
