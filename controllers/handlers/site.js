 module.exports = function(db,itemsPerPage) {    
    
    var ITEMS_PER_PAGE = itemsPerPage; 
    
    var ItemDAO = require('../../models/item').ItemDAO,
        UserDAO = require('../../models/users').UserDAO;
    var items = new ItemDAO(db),
        users = new UserDAO(db);

    var module = {};
    // Homepage 
    module.index = function(req, res) { //site.index
        "use strict";
        //var logged=false, userId, userName, admin=false;
        var sess = req.session;
        sess.user = {};
        if ((sess.logged)&&(!sess.user.id)) { //2nd cond checks if I've already stored user data
            users.getData(sess.email, function(U_id,U_name,U_isadmin){
                sess.user = {
                    id : U_id,
                    name : U_name,
                    admin : U_isadmin
                };
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
                                            user: sess.user,
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
    };

    module.search = function(req, res) {
        "use strict";
        var page = req.query.page ? parseInt(req.query.page) : 0;
        var query = req.query.query ? req.query.query : "";
        items.searchItems(query, page, ITEMS_PER_PAGE, function(searchItems) {
            items.getNumSearchItems(query, function(itemCount) {
                var numPages = 0;
                if (itemCount > ITEMS_PER_PAGE)
                    numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                res.render('search', { queryString: query,
                                       itemCount: itemCount,
                                       pages: numPages,
                                       page: page,
                                       items: searchItems });
            });
        });
    };

    return module;
}

/*
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