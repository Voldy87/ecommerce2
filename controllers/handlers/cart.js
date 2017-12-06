 module.exports = function(db,guestId) {

    var GUEST_USERID = guestId;

    var CartDAO = require('../../models/cart').CartDAO;
    var cart = new CartDAO(db);

    var module = {};
    
    module.redirCart = function(req, res) {
        var id = (!req.session.logged) ? GUEST_USERID : req.session.user.id;
        res.redirect("/user/" + id  + "/cart");
    };

    module.viewCart = function(req, res) {
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
                              logged: req.session.logged,
                              user: req.session.user,
                              userId: userId,
                              userName: req.session.user.name,
                              updated: false,
                              cart: userCart,
                              total: total
                           });
            });
        }
    };

    
    module.addItem = function(req, res) {
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
    };
 
    module.editItem = function(req, res) {
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
    };
    
  
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
    } return module;

  };