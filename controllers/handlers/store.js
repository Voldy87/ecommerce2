exports.landing =  function(req, res) {
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
    };  

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