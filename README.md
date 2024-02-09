# Server requirements

1. Docker Engine with Docker Compose or Docker Desktop installed
2. Git installed
3. Node.js installed
4. Pull project via github - RUN command 'git clone https://github.com/MaciejZab/node-vue-postgres.git' in the desired server directory

## Pre-run

1. Adjust settings in '.env' file
2. Run command 'npm install' in /vue and /node
3. Run command 'npm run build' in /vue and /node

### Run Docker Containers

5.  Run command 'docker-compose build' in the root directory
6.  Run command 'docker-compose up -d' in the root directory
