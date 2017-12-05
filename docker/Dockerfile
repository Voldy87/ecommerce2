LABEL version="1.0"
LABEL description="Dockerfile to run the unrealmart Express app with Mongo"
FROM node:carbon
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /app
COPY package-lock.json /app
RUN npm install --only=production
COPY . /app
ENV SERVER_PORT 3000
ENV DB_URL ""
RUN node unrealmart.js $SERVER_PORT $DB_URL # CMD npm start
# this port must be equal to the one mapped in the docker run command
EXPOSE $SERVER_PORT