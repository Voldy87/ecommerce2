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


/*
router.get("/cart", products.addToCart);*/
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    
MongoClient.connect('mongodb://127.0.0.1:27017/mongomart', function(err, db) {  

	var shopper = require('./shopper')(db),
		products = require('./products')(db),
		site = require('./site')(db),
		accounts = require('./accounts'),
		stores = require('./stores');
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
	/*
	router.get("/location", site.location);*/

	// Sessions
	router.get("/login", accounts.signupLanding);
	router.post("/login", accounts.signupSend);
	router.get('/logout', accounts.signout);
	router.get('/register', accounts.signinLanding);
	router.post('/register', accounts.signinSend);
});

module.exports = router;

