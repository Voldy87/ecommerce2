var express = require('express'), //need all??
	router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var config = require('../config/config');


module.exports = router;


	MongoClient.connect(config.loadDbConfig("mongo"), function(err, db) {  
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
			user = require('./handlers/user'),
			store = require('./handlers/store'),
			admin = require('./handlers/admin')(); 
		// General
		router.get("/", site.index);
		router.get('/search', site.search);
		// Shop Items
		router.get("/item/all_names",item.allNames); //the starting date is inside the body
		router.get("/item/new_comments",item.newCommentsNumber); //the starting date is inside the body
		router.get("/item/new", item.insertForm);
		router.post("/item/new", item.insertAction);
		router.get("/item/:itemId", item.view);
		router.post("/item/:itemId/reviews",item.comment);
		//User's Cart items
		router.get("/cart", cart.redirCart);
		router.get("/user/:userId/cart", cart.viewCart);
		router.post("/user/:userId/cart/items/:itemId", cart.addItem);
		router.post("/user/:userId/cart/items/:itemId/quantity", cart.editItem);
		//User's Page
		router.get("/user/:userId", user.landing);
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
		// Admin
		router.get("/admin/sysinfo", admin.sysinfo);
		router.get("/admin/backup/database", admin.saveBackup);
		router.get("/admin/backup/local", admin.downloadBackup);
	});
		


