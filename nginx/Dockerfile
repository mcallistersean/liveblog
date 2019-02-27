FROM node:6 as node-build
WORKDIR /build
COPY ./client/package.json .
RUN npm -g install -g grunt-cli && npm install
COPY ./client .
RUN grunt build



