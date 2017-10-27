
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function StoreDAO(database) {
    "use strict";
    this.db = database;
    const minZip = 0;
    //usa una var pipeline x fare le aggregation


    /*this.getCategories = function(callback) {
        "use strict";
        this.db.collection("item").aggregate( [{$project:{"category":1,_id:0}}, {$group:{_id:"$category",num:{$sum:1}}}, {$sort:{ _id:1}}]).toArray(function(err, categories) {
            assert.equal(null, err);
            var total = 0;
            for (var i=0; i<categories.length; i++)
                total += categories[i].num;
            var item = {"_id":"All", "num":total};
            categories.splice(0,0,item);
            callback(categories);
        });
    }*/


    /*this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
        var categoryFindFilter;
        if (category=="All")
            categoryFindFilter={};
        else 
             categoryFindFilter={"category":category};
        var cursor = this.db.collection('item').find(categoryFindFilter);
        cursor.skip(page*itemsPerPage);
        cursor.limit(itemsPerPage);
        cursor.sort({"_id":1});
        cursor.toArray(function(err, pageItems) {
            assert.equal(null, err);
            callback(pageItems);
        });
    }*/


    /*this.getNumItems = function(category, callback) {
        "use strict";
        var numItems = 0;
        var categoryFindFilter;
        if (category=="All")
            categoryFindFilter={};
        else 
             categoryFindFilter={"category":category};        
        this.db.collection('item').find(categoryFindFilter).count(function(err, numItems) {
            assert.equal(null, err);
            callback(numItems);
        });
    }*/


    /*this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";
        var queryDoc;
        if (query.trim() == "")
            queryDoc = {};
        else 
            queryDoc = { "$text": {"$search": query} };  
        var cursor = this.db.collection("item").find( queryDoc );
        cursor.skip(page*itemsPerPage);
        cursor.limit(itemsPerPage);
        cursor.sort({"_id":1});
        cursor.toArray(function(err, items) {
            assert.equal(null, err);
            callback(items);
        });
        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // of search results to the callback.
        //callback(items);
    }*/


    /*this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        var queryDoc;
        if (query.trim() == "")
            queryDoc = {};
        else 
            queryDoc = { "$text": {"$search": query} };  
        var cursor = this.db.collection("item").find( queryDoc ).count(function(err, numItems) {
            assert.equal(null, err);
            callback(numItems);
        });
    }*/


    /*this.getItem = function(itemId, callback) {
        "use strict";

        this.db.collection("item").find( {"_id":itemId}).toArray(function(err, ret) {
            assert.equal(null, err);            
            var item = null;
            if (ret.length > 0)
                item = ret[0];   
            callback(item);
        });
        // TODO Include the following line in the appropriate
        // place within your code to pass the matching item
        // to the callback.
        //callback(item);
    }*/


    /*this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };*/


    /*this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }


        this.db.collection("item").updateOne(
            {_id: itemId},
            {"$push": {reviews: reviewDoc}},
            function(err, doc) {
                assert.equal(null, err);
                callback(doc);
            });

    }*/


    /*this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }*/
}


module.exports.StoreDAO = StoreDAO;