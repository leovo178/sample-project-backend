FROM node:12.16.1
EXPOSE 4000
WORKDIR /usr/src/app

RUN npm install -g nodemon node-gyp

COPY . ./
RUN rm -rf ./tests

# Create app directory
COPY package*.json ./
RUN npm install
