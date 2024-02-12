FROM node:18

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

RUN mkdir dist

COPY ./dist ./dist

CMD ["node", "./dist/index.js"]