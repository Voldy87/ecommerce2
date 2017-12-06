var express = require('express');//('../.');

var router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


var config = require('../config');

	var dbURL;
	
    if (config.currentEnv=='production') { //nodemon does not support prompt

            //console.log('  username: ' + result.username);
            dbURL = process.argv[3];
            connect_and_route(dbURL);
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
    	//console.log("Successfully connected to MongoDB");

		 //create index for text search
	    db.collection("item").createIndex({title:"text",slogan:"text",description:"text"});

	    var cart = require('./handlers/cart')(db,config.guestId),
			item = require('./handlers/item')(db,config.guestId),
			order = require('./handlers/order')(db,config.guestId),
			site = require('./handlers/site')(db,config.itemsPerPage),
			accounts = require('./handlers/accounts'),
			store = require('./handlers/store'); 
		// General
		router.get("/", site.index);
		router.get('/search', site.search);
		// Shop Items
		router.get("/item/new_comments",item.newCommentsNumber); //the starting date is inside the body
		router.get("/item/:itemId", item.view);
		router.post("/item/:itemId/reviews",item.comment);
		//User's Page
		//router.get("/user/:userId", user.page);
		//User's Cart items
		router.get("/cart", cart.redirCart);
		router.get("/user/:userId/cart", cart.viewCart);
		router.post("/user/:userId/cart/items/:itemId", cart.addItem);
		router.post("/user/:userId/cart/items/:itemId/quantity", cart.editItem);
		//Orders
		router.get("/order/new_orders", order.newTotalNumber);
		// Stores
		router.get("/location", store.landing);
		// Sessions
		router.get("/login", accounts.signupLanding);
		router.post("/login", accounts.signupSend);
		router.get('/logout', accounts.signout);
		router.get('/register', accounts.signinLanding);
		router.post('/register', accounts.signinSend);
	});
		

}


