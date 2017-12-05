FROM node:carbon
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
package*.json /app
RUN npm install
# If you are building your code for production
# RUN npm install --only=production
COPY . /app
CMD ["node","unrealmart.js"] # CMD npm start
# this port must be equal to the one mapped in the docker run command and the one the nodexpress server is launched with
EXPOSE 33333