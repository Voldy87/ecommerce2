//MONGO DB - always connected

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = function(userId, callback) {
        "use strict";

        var match = {$match:{"userId": userId}};
        var unwind = {$unwind: "$items"};
        var lookup = {
           "$lookup":
             {
               "from": "item",
               "localField": "items._id",
               "foreignField": "_id",
               "as": "product"
             }
        };
        var project = { 
            "$project": 
            {
                "_id":0,  
                "quantity":"$items.quantity",
                "id":"$product._id",
                "title":"$product.title",
                "img_url":"$product.img_url",
                "price":"$product.price"
            } 
        };
        var project2 = {
         $project:
          {
             "id": { $arrayElemAt: [ "$id", 0 ] },
             "title": { $arrayElemAt: [ "$title", 0 ] },
             "img_url": { $arrayElemAt: [ "$img_url", 0 ] },
             "price": { $arrayElemAt: [ "$price", 0 ] },
             "quantity":1
          }
       }; 
        //this.db.collection("cart").find({"userId": userId}).toArray(function(err, item) {
        this.db.collection("cart").aggregate([match,unwind,lookup,project,project2]).toArray(function(err, item) {
                assert.equal(null, err);
                var userCart = null;
                if (item.length > 0)
                    userCart = item;
                                            //userCart = item; 
                                             console.log(item);
                callback(userCart);
            });
        // This could also be implemented in this mode:
 /*   this.db.collection("cart").find({userId: userId}).limit(1).next(function(err, doc) {
        assert.equal(null, err);
        assert.ok(doc);

        callback(doc);
    });*/
 
    }


    this.itemInCart = function(userId, itemId, callback) {
        "use strict";

         this.db.collection("cart").find({"userId": userId, "items._id":itemId}, {"items.$":1,"_id":0}).toArray(function(err,arr){
            if (arr.length>0)
                callback(arr[0]);
            else
                callback(null);
         });
        //callback(null);
        //other sol:
        /*this.db.collection("cart")
        .find({userId: userId, "items._id": itemId}, {"items.$": 1})
        .limit(1)
        .next(function(err, item) {
            assert.equal(null, err);
            console.log(err);
            if (item != null) {
                item = item.items[0];
            }
            console.log(item);
            callback(item);
        });*/

        // TODO-lab6 Replace all code above (in this method).
    }


    /*
     * This solution is provide as an example to you of several query
     * language features that are valuable in update operations.
     * This method adds the item document passed in the item parameter to the
     * user's cart. Note that this solution works regardless of whether the
     * cart already contains items or is empty. addItem will be called only
     * if the cart does not already contain the item. The route handler:
     * router.post("/user/:userId/cart/items/:itemId"...
     * handles this. Please review how that method works to have a complete
     * understanding of how addItem is used.
     *
     * NOTE: One may use either updateOne() or findOneAndUpdate() to
     * write this method. We did not discuss findOneAndUpdate() in class,
     * but it provides a very straightforward way of solving this problem.
     * See the following for documentation:
     * http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOneAndUpdate
     *
     */
    this.addItem = function(userId, item, callback) {
        "use strict";

        // Will update the first document found matching the query document.
        this.db.collection("cart").findOneAndUpdate(
            // query for the cart with the userId passed as a parameter.
            {userId: userId},
            // update the user's cart by pushing an item onto the items array
            {"$push": {items: item}},
            // findOneAndUpdate() takes an options document as a parameter.
            // Here we are specifying that the database should insert a cart
            // if one doesn't already exist (i.e. "upsert: true") and that
            // findOneAndUpdate() should pass the updated document to the
            // callback function rather than the original document
            // (i.e., "returnOriginal: false").
            {
                upsert: true,
                returnOriginal: false
            },
            // Because we specified "returnOriginal: false", this callback
            // will be passed the updated document as the value of result.
            function(err, result) {
                assert.equal(null, err);
                // To get the actual document updated we need to access the
                // value field of the result.
                callback(result.value);
            });

        /*

          Without all the comments this code looks written as follows.

        this.db.collection("cart").findOneAndUpdate(
            {userId: userId},
            {"$push": {items: item}},
            {
                upsert: true,
                returnOriginal: false
            },
            function(err, result) {
                assert.equal(null, err);
                callback(result.value);
            });
        */

    };


    this.updateQuantity = function(userId, itemId, quantity, callback) {
        "use strict";

         var updateDoc = {};

        if (quantity == 0) 
            updateDoc = { "$pull": { items: { _id: itemId } } };
        else 
            updateDoc = { "$set": { "items.$.quantity": quantity } };
        this.db.collection("cart").findOneAndUpdate(
            { userId: userId, "items._id": itemId },
            updateDoc,
            { returnOriginal: false },
            function(err, result) {
                assert.equal(null, err);
                callback(result.value);
        });

    }

}


module.exports.CartDAO = CartDAO;
