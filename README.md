# Unreal Mart
## Introduction
This website is a fake mart that sell mostly non-existent things (real or abstract): its _only purpose_ is to show how to use some web development techniques.
## Technical details
This site uses a mix of technologies for the different parts of the application, but broadly speaking it can be defined as a MVC structure with the Express NodeJS framework and MongoDB:
* the "View" has Express (back-end) use web templates for showing the various elements (stores, items, cart, etc.);
* the "Controller" is managed by Express using routes over HTTP methods
* the "Model" sees  all data stored in a MongoDB database, accessed via JavaScript-based DAO interfaces, without ODM

One exception (another MVC way) is the administration panel (back-end), which is a single page using [jQuery](http://jquery.com/) client script.
This script make router requests to the Controller via Ajax instead of simple HTTP verbs, and update the page "View" using response from the abovementioned Controller.
## Possibile improvements
Many things yet to do.

## How to use it
### npm
For development (default is NODE_ENV is unset) you can simply run "npm start", thus launching the app with nodemon. In production (set NODE_ENV to this value) launch "node unrealmart.js" with arguments (1) the port on which the server will listen on the server and (2) the url of the Mongo database which stores the data 
### Docker(only production)
You can use [this container](https://cloud.docker.com/swarm/aerdna/repository/docker/aerdna/unrealmart/general): the "docker run" command needs to be launched setting the environment variables PORT(port on which the server will listen inside the container, not very important) and the url of the Mongo database which stores: these variables will be fed (internally within the container) to the "node unrealmart.js" 
For now there is only a pre-logged anonoymous user with his cart.

## License