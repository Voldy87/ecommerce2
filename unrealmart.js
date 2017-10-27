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
    engines = require('consolidate'),
    nunjucks = require('nunjucks'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    //one DAO for each collection
    ItemDAO = require('./item').ItemDAO,
    CartDAO = require('./cart').CartDAO,
    StoreDAO = require('./store').StoreDAO;
    
// Set up express
app = express();
// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//serve static (c-side tecj as js,html,css) file, i.e. w/out nodejs serv-side elaboration (routing, etc.)
app.use('/static', express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: true }));
// assign the various engines to different extensions files
app.engine('html', engines.nunjucks);
app.engine('handlebars', engines.handlebars);
app.engine('mustache', engines.mustache);
app.engine('pug', engines.pug);
app.engine('underscore', engines.underscore);


//https://github.com/tj/consolidate.js/pull/224


var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
var nunjucksDate = require('nunjucks-date');
nunjucksDate.setDefaultFormat('MMMM Do YYYY, h:mm:ss a');
env.addFilter("date", nunjucksDate);


var ITEMS_PER_PAGE = 5;


// Hardcoded USERID for use with the shopping cart portion  (CHANGE)
var USERID = "558098a65133816958968d88";
//CHANGE NAME OF DB!!
MongoClient.connect('mongodb://127.0.0.1:27017/mongomart', function(err, db) {
    "use strict";
    //if the connections goes well or not..
    assert.equal(null, err); 
    console.log("Successfully connected to MongoDB.");
    //create DAOS "class" objects
    var items = new ItemDAO(db);
    var cart = new CartDAO(db);
    var store = new StoreDAO(db);
    // express routing middleware
    var router = express.Router();

//proof of work mustache inside consolidate -  TO CHANGE!
router.get("/mustache", function(req, res) {
        "use strict";
      res.render('news.mustache', { name: 'tobi',value:33 });                
});
    //create index for text search
    db.collection("item").createIndex({title:"text",slogan:"text",description:"text"});

    // Homepage 
    router.get("/", function(req, res) {
        "use strict";
        // default: page 1 (has index 0), category "All"
        var page = req.query.page ? parseInt(req.query.page) : 0; 
        var category = req.query.category ? req.query.category : "All";

        items.getCategories(function(categories) {
//get the items obj from the db and pass it to the cb (that is, to the inner function), with argument created inside its body and available (clousre) to all inners functions
            items.getItems(category, page, ITEMS_PER_PAGE, function(pageItems) {

                items.getNumItems(category, function(itemCount) {

                    var numPages = 0;
                    if (itemCount > ITEMS_PER_PAGE) {
                        numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                    }
                
                    res.render('home', { category_param: category,
                                         categories: categories,
                                         useRangeBasedPagination: false,
                                         itemCount: itemCount,
                                         pages: numPages,
                                         page: page,
                                         items: pageItems });
                    
                });
            });
        });
    });

    router.get("/search", function(req, res) {
        "use strict";

        var page = req.query.page ? parseInt(req.query.page) : 0;
        var query = req.query.query ? req.query.query : "";

        items.searchItems(query, page, ITEMS_PER_PAGE, function(searchItems) {

            items.getNumSearchItems(query, function(itemCount) {

                var numPages = 0;
                
                if (itemCount > ITEMS_PER_PAGE) {
                    numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                }
                
                res.render('search', { queryString: query,
                                       itemCount: itemCount,
                                       pages: numPages,
                                       page: page,
                                       items: searchItems });
                
            });
        });
    });


    router.get("/item/:itemId", function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);

        items.getItem(itemId, function(item) {
            console.log(item);

            if (item == null) {
                res.status(404).send("Item not found.");
                return;
            }
             
            var stars = 0;
            var numReviews = 0;
            var reviews = [];
            
            if ("reviews" in item) {
                numReviews = item.reviews.length;

                for (var i=0; i<numReviews; i++) {
                    var review = item.reviews[i];
                    stars += review.stars;
                }

                if (numReviews > 0) {
                    stars = stars / numReviews;
                    reviews = item.reviews;
                }
            }

            items.getRelatedItems(function(relatedItems) {

                console.log(relatedItems);
                res.render("item",
                           {
                               userId: USERID,
                               item: item,
                               stars: stars,
                               reviews: reviews,
                               numReviews: numReviews,
                               relatedItems: relatedItems
                           });
            });
        });
    });


    router.post("/item/:itemId/reviews", function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);
        var review = req.body.review;
        var name = req.body.name;
        var stars = parseInt(req.body.stars);

        items.addReview(itemId, review, name, stars, function(itemDoc) {
            res.redirect("/item/" + itemId);
        });
    });


    /*
     *
     * Since we are not maintaining user sessions in this application, any interactions with 
     * the cart will be based on a single cart associated with the the USERID constant we have 
     * defined above.
     *
     */
    router.get("/cart", function(req, res) {
        res.redirect("/user/" + USERID + "/cart");
    });

               
    router.get("/user/:userId/cart", function(req, res) {
        "use strict";

        var userId = req.params.userId;
        cart.getCart(userId, function(userCart) {
            var total = cartTotal(userCart);
            res.render("cart",
                       {
                           userId: userId,
                           updated: false,
                           cart: userCart,
                           total: total
                       });
        });
    });

    
    router.post("/user/:userId/cart/items/:itemId", function(req, res) {
        "use strict";

        var userId = req.params.userId;
        var itemId = parseInt(req.params.itemId);

        var renderCart = function(userCart) {
            var total = cartTotal(userCart);
            res.render("cart",
                       {
                           userId: userId,
                           updated: true,
                           cart: userCart,
                           total: total
                       });
        };

        cart.itemInCart(userId, itemId, function(item) {
            if (item == null) {
                items.getItem(itemId, function(item) {
                    item.quantity = 1;
                    cart.addItem(userId, item, function(userCart) {
                        renderCart(userCart);
                    });
            
                });
            } else {
                cart.updateQuantity(userId, itemId, item.quantity+1, function(userCart) {
                    renderCart(userCart);
                });
            }
        });
    });


    router.post("/user/:userId/cart/items/:itemId/quantity", function(req, res) {
        "use strict";
        
        var userId = req.params.userId;
        var itemId = parseInt(req.params.itemId);
        var quantity = parseInt(req.body.quantity);

        cart.updateQuantity(userId, itemId, quantity, function(userCart) {
            var total = cartTotal(userCart);
            res.render("cart",
                       {
                           userId: userId,
                           updated: true,
                           cart: userCart,
                           total: total
                       });
        });
    });
    
 
    function cartTotal(userCart) {
        "use strict";

        var total = 0;
        for (var i=0; i<userCart.items.length; i++) {
            var item = userCart.items[i];
            total += item.price * item.quantity;
        }

        return total;
    }

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


   /* router.get("/stores/:storeId", function(req, res) {
        "use strict";
        var storeId = parseInt(req.params.storeId);
        items.getItem(storeId, function(store) {
            console.log(store);
            if (store == null) {
                res.status(404).send("Store not found.");
                return;
            }
            var stars = 0;
            var numReviews = 0;
            var reviews = [];
            if ("reviews" in store) {
                numReviews = store.reviews.length;
                for (var i=0; i<numReviews; i++) {
                    var review = store.reviews[i];
                    stars += review.stars;
                }
                if (numReviews > 0) {
                    stars = stars / numReviews;
                    reviews = store.reviews;
                }
            }

        });
    });*/

    
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
