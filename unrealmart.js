/** 
 *  @fileOverview Main Node/Express application
 *
 *  @author       Andrea Orlandi
 * 
 *  @requires     NPM: express, bodyParser, consolidate, mongodb, assert, engines
 *  @requires     INTERNAL: cart.js, item.js, stores.js
 */
var config = require('./config');
console.log("The app is running in "+config.currentEnv+" mode.");

var express = require('express'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    //template web engines
    engines = require('consolidate'),
    ejs = require('ejs'),
    nunjucks = require('nunjucks'),
    //sessions
    session = require('express-session'), //Since 1.5.0 "cookie-parser" mw is no longer needed
    flash = require('req-flash'),
    prompt = require('prompt'),

    SecurityWithHash = require('./services/secure').SecurityWithHash;

    moment.locale(); 
    // Set up express
    app = express(); 
    // assign the various engines to different extensions files and set .html as the default extension
    app.engine('html', engines.nunjucks);
    app.engine('ejs', engines.ejs);
    app.engine('handlebars', engines.handlebars);
    app.engine('mustache', engines.mustache);
    app.engine('pug', engines.pug);
    app.engine('underscore', engines.underscore);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    //serve static (c-side tecj as js,html,css) file, i.e. w/out nodejs serv-side elaboration (routing, etc.)
    app.use('/static', express.static(__dirname + '/static'));

    app.use(bodyParser.urlencoded({ extended: true }));
     
    // session handling
    var secret = 'ssshhhhh';
    app.use(session({secret: secret}));
    app.use(flash()); 

    // express routing middleware 
    var router = express.Router();

    //start server
    var server;
    
    if (config.currentEnv=='production') { //nodemon does not support prompt
        prompt.start();
        prompt.get(['server_port'], function (err, result) {
            // 
            // Log the results. 
            // 
            console.log('Command-line input received');
            //console.log('  username: ' + result.username);
            server = app.listen(result.server_port, function() { // Start the server listening
                console.log('Unreal Mart NodeJS server is listening on port %s.', server.address().port);
                app.use(require('./controllers/routes'));
                app.use('/', router); // Use the router routes in our application    
                //The 404 Route (ALWAYS Keep this as the last route)
                app.get('*', function(req, res){ 
                  res.status(404).render('404');
                });
            });
        });
    }
    else {
        server = app.listen(config.server.port, function() { // Start the server listening
                console.log('Unreal Mart NodeJS server is listening on port %s.', server.address().port);
                app.use(require('./controllers/routes'));
                app.use('/', router); // Use the router routes in our application
                //The 404 Route (ALWAYS Keep this as the last route)
                app.get('*', function(req, res){ 
                  res.status(404).render('404');
                });
        });
    }
    