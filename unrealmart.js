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
    ItemDAO = require('./item').ItemDAO,
    CartDAO = require('./cart').CartDAO,
    StoreDAO = require('./store').StoreDAO,
    UserDAO = require('./users').UserDAO;
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

 
/*var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
var nunjucksDate = require('nunjucks-date');
nunjucksDate.setDefaultFormat('MMMM Do YYYY, h:mm:ss a');
env.addFilter("date", nunjucksDate);*/


var ITEMS_PER_PAGE = 5;


// default id of an unlogged ("guest") user
var GUEST_USERID = "0";
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
    var users = new UserDAO(db);
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
        //var logged=false, userId, userName, admin=false;
        var sess = req.session;
        if ((sess.logged)&&(!sess.userId)) { //2nd cond checks if I've already stored user data
            users.getData(sess.email, function(id,name,isadmin){
                sess.userId = id;
                sess.userName = name;
                sess.admin = isadmin;
                //logged = true; 
                console.log("userdb access!");
            });
        }
        /*else
            logged = false;*/
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
                
                    res.render('home', {    logged: sess.logged,
                                            admin: sess.admin,
                                            userId: sess.userId,
                                            userName: sess.userName,
                                            category_param: category,
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

                    review.date = moment(review.date).format('llll'); // Tue, Nov 28, 2017 11:25 AM;//review.date.toString();
                    
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
                               userId: GUEST_USERID,
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
        var id = (!req.session.logged) ? GUEST_USERID : req.session.userId;
        res.redirect("/user/" + id  + "/cart");
    });

                
    router.get("/user/:userId/cart", function(req, res) {
        "use strict";
        var userId = req.params.userId;
        if (userId==GUEST_USERID) {//has to take params from temp cookie from the currentlu unlogged guest user
            res.render("cart",   
                       {
                           userId: 0,
                           userName: "a guest",
                           updated: false,
                           //cart: userCart,
                           total: 0//total
                       });
        }
        else {
            //var userId = req.params.userId;
            cart.getCart(parseInt(userId), function(userCart) {
                var total = cartTotal(userCart);
                res.render("cart",  
                           {  
                               userId: userId,
                               userName: req.session.userName,
                               updated: false,
                               cart: userCart,
                               total: total
                           });
            });
        }
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
        if (!userCart) 
            return total;
        for (var i=0; i<userCart.length; i++) {
            var item = userCart[i];
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
    });
    

    app.get('/admin',function(req,res){
        sess = req.session;
        if(sess.email) {
        res.write('<h1>Hello '+sess.email+'</h1>');
        res.end('<a href="+">Logout</a>');
        } else {
            res.write('<h1>Please login first.</h1>');
            res.end('<a href="+">Login</a>');
        }
    });*/

    router.get("/login", function(req, res) {
        "use strict";
        //app.set('view engine', 'pug')
        res.render('login.pug',{ title: 'Login Page @UnrealMart', flash: req.flash()});           
    });
 
    router.post('/login',function(req,res){
        /* 
            1) check user exists for that req.body.email and in case get corresponding hashed password (if the user exist!)
        if (!user.hash)
            req.flash('error', 'Email and/or password are incorrect');
         use previous data and req.body.password to check correspondance
        users.checkCredentials(user.hash, req.body.password, user.algorithm, function(err,validLogin){
            if(err){
                //gestisci errore..
            }
            if (validLogin) {
                req.session.logged = true;
                res.redirect('/');
            } else {
                req.flash('error', 'Email and/or password are incorrect');
                res.redirect('/login');
            } 
        });*/
        if (req.body.email && req.body.email === 'user' && req.body.password && req.body.password === 'pass') {
            req.session.logged = true;
            req.session.email = req.body.email;
            res.redirect('/');
        } else {
            req.flash('error', 'Email and password are incorrect');
            res.redirect('/login');
        }     
      /*sess = req.session;
      sess.email=req.body.email;
      res.end('done');*/
    });

    router.get('/logout',function(req,res){
        req.session.destroy(function(err) {
            if(err)
                console.log(err);
            else 
                res.redirect('/');
        });
    });    

    router.get('/register',function(req,res){
        res.render('register.ejs',{ title: 'Creating your UnrealMart account..'});
    });

    router.post('/register',function(req,res){
        /*
        check db if req.body.email non c'è già..
        createCredentials(req.password, 'argon2', function(err,derivedKey,salt){
            if(err){
                //...
            }
            else {
                    var strechedPassword: derivedKey;
                    var salt: salt;
            } insert user data, (send confirm email), comunicate login + redirect con session login (da levare poi se il sistema deiventa sofisticato con mail di prima & co.)
        });

        */
    });

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
