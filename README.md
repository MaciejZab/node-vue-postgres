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

    1. Start the Docker containers in detached mode (background) by running:

        - docker-compose up -d

### Development

    To facilitate seamless development, the local host volumes /vue/dist and /node/dist are connected with the corresponding containers. However, to finally reflect changes made during development, developers need to rebuild the /node and /vue applications.

    1. Modify the source code within the /node and /vue directories to implement desired changes.

    2. Rebuild the Node.js backend and Vue.js frontend applications running the following command in both the /vue and /node directories:

        - npm run build

        Optionally run the following command to see changes immediately without the need to rebuild the application on every change manually (development port will appear in terminal):

        - npm run dev

    Once the applications are rebuilt, the changes will automatically be reflected in the connected containers due to the volume mapping with /vue/dist and /node/dist.
