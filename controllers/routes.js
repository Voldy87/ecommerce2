/**
 * Module dependencies.
 */

var express = require('express');//('../.');
//var path = require('path');
var app = express();

/*var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');*/

// Config
/*
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// istanbul ignore next 
if (!module.parent) {
  app.use(logger('dev'));
}

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
*/

var router = express.Router();
var config = require('../config');

/*
router.get("/cart", products.addToCart);*/
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    //CHANGE NAME OF DB!! 
    console.log(config.db.URL);
MongoClient.connect('mongodb://127.0.0.1:27017/mongomart', function(err, db) {  
	   "use strict";
    	assert.equal(null, err); 
    	console.log("Successfully connected to MongoDB.");

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

module.exports = router;

