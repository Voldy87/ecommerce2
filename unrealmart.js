/** 
 *  @fileOverview Main Node/Express application
 *
 *  @author       Andrea Orlandi
 * 
 *  @requires     NPM: express, bodyParser, consolidate, mongodb, assert, engines
 *  @requires     INTERNAL: cart.js, item.js, stores.js
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    //template web engines
    engines = require('consolidate'),
    ejs = require('ejs'),
    nunjucks = require('nunjucks'),
    //db
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    //sessions
    session = require('express-session'), //Since 1.5.0 "cookie-parser" mw is no longer needed
    flash = require('req-flash'),
    //one DAO for each collection
    // 
    SecurityWithHash = require('./secure').SecurityWithHash;

moment.locale(); 
// Set up express
app = express(); 
// assign the various engines to different extensions files
app.engine('html', engines.nunjucks);
app.engine('ejs', engines.ejs);
app.engine('handlebars', engines.handlebars);
app.engine('mustache', engines.mustache);
app.engine('pug', engines.pug);
app.engine('underscore', engines.underscore);
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//serve static (c-side tecj as js,html,css) file, i.e. w/out nodejs serv-side elaboration (routing, etc.)
app.use('/static', express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: true }));
 
// session handling
var secret = 'ssshhhhh';
app.use(session({secret: secret}));
app.use(flash()); 
//https://github.com/tj/consolidate.js/pull/224

var ITEMS_PER_PAGE = 5; 

// default id of an unlogged ("guest") user
var GUEST_USERID = "0";
//CHANGE NAME OF DB!! 
MongoClient.connect('mongodb://127.0.0.1:27017/mongomart', function(err, db) {
    "use strict";
    //if the connections goes well or not..
    assert.equal(null, err); 
    console.log("Successfully connected to MongoDB.");
    // express routing middleware 
    var router = express.Router();

    //create index for text search
    db.collection("item").createIndex({title:"text",slogan:"text",description:"text"});



   router.get("/location", function(req, res) {
        "use strict";
        var page = req.query.page ? parseInt(req.query.page) : 0;
        var query = req.query.query ? req.query.query : "";/*
        stores.searchStores(query, page, STORES_PER_PAGE, function(searchStores) {
            stores.getNumSearchStores(query, function(itemCount) {
                var numPages = 0;
                if (storeCount > STORES_PER_PAGE) { 
                    numPages = Math.ceil(itemCount / STORES_PER_PAGE);
                }*/
                res.render('locations', { 
                    zip_error:"eeeeee",
                    city_and_state_error:"sssss",  
                    stores:{},
                    pages:1, 
                    num_stores:0,  
                    states:{}   
               });
           /* });   
        });*/ 
    });


app.use(require('./routes/index'));


    app.use('/', router); // Use the router routes in our application

    //The 404 Route (ALWAYS Keep this as the last route)
    app.get('*', function(req, res){ 
      res.status(404).render('404');
    });

    var server = app.listen(3000, function() { // Start the server listening
        var port = server.address().port;
        console.log('Unreal Mart NodeJS server is listening on port %s.', port);
    });

});
