var express = require('express');//('../.');

var router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
	prompt = require('prompt');

var config = require('../config');

	var dbURL;
	
    if (config.currentEnv=='production') { //nodemon does not support prompt
        prompt.start();
        prompt.get(['database_url'], function (err, result) {
            console.log('Command-line input received');
            //console.log('  username: ' + result.username);
            dbURL = result.database_url;
            connect_and_route(dbURL);
        });
    }
    else {
        dbURL = config.db.host + ":" + config.db.port + "/" + config.db.name;
        connect_and_route(dbURL);
    }

module.exports = router;

function connect_and_route(dbURL){
	MongoClient.connect('mongodb://'+dbURL, function(err, db) {  
	   "use strict";
    	assert.equal(null, err); 
    	console.log("Successfully connected to MongoDB");

		 //create index for text search
	    db.collection("item").createIndex({title:"text",slogan:"text",description:"text"});

	    var shopper = require('./handlers/shopper')(db,config.guestId),
			products = require('./handlers/products')(db,config.guestId),
			site = require('./handlers/site')(db,config.itemsPerPage),
			accounts = require('./handlers/accounts'),
			stores = require('./handlers/stores'); 
		// General
		router.get("/", site.index);
		router.get('/search', site.search);
		// Shop Items
		router.get("/item/:itemId", products.view);
		router.post("/item/:itemId/reviews",products.comment);
		//User's C+art items
		router.get("/cart", shopper.redirCart);
		router.get("/user/:userId/cart", shopper.viewCart);
		router.post("/user/:userId/cart/items/:itemId", shopper.addItem);
		router.post("/user/:userId/cart/items/:itemId/quantity", shopper.editItem);
		// Stores
		router.get("/location", stores.landing);
		// Sessions
		router.get("/login", accounts.signupLanding);
		router.post("/login", accounts.signupSend);
		router.get('/logout', accounts.signout);
		router.get('/register', accounts.signinLanding);
		router.post('/register', accounts.signinSend);
	});
		

}


