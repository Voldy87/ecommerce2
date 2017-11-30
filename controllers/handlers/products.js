 module.exports = function(db,guestId) {

    var moment = require('moment');

    var GUEST_USERID = guestId;
    var ItemDAO = require('../../models/item').ItemDAO;
    var items = new ItemDAO(db);

    var module = {};

    module.view =  function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);

        items.getItem(itemId, function(item) {

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

                res.render("item", {
                    logged: req.session.logged,
                    user: req.session.user,
                    userId: GUEST_USERID,
                    item: item,
                    stars: stars,
                    reviews: reviews,
                    numReviews: numReviews,
                    relatedItems: relatedItems
                });
            });
        });
    };


   module.comment = function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);
        var review = req.body.review;
        var name = req.body.name;
        var stars = parseInt(req.body.stars);

        items.addReview(itemId, review, name, stars, function(itemDoc) {
            res.redirect("/item/" + itemId);
        });
    };

                
return module;
};