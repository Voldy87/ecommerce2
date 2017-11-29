  

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