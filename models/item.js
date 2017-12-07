var assert = require('assert');


function ItemDAO(database) { // item object class prototypes (1 var member, others functions)
    "use strict";

    this.db = database;
    
    this.getCategories = function(callback) {
        "use strict";
        var project = {"$project":{"category":1,"_id":0}},
            group = {"$group":{"_id":"$category","num":{"$sum":1}}},
            sort = {"$sort":{ "_id":1}};
        this.db.collection("item").aggregate( [project,group,sort]).toArray(function(err, categories) {
            assert.equal(null, err);
            var total = 0;
            for (var i=0; i<categories.length; i++)
                total += categories[i].num;
            var item = {"_id":"All", "num":total};
            categories.splice(0,0,item);
            callback(categories);
        });
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
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
    }


    this.getNumItems = function(category, callback) {
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
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * Use limit() and skip() and the method parameters: page and
         * itemsPerPage to select the appropriate matching products. Pass these
         * items to the callback function.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         * db.item.createIndex({title:"text",slogan:"text",description:"text"})
         * 
         */

       /* var item = this.createDummyItem();
        var items = [];
        for (var i=0; i<5; i++) {
            items.push(item);
        }*/

        // TODO-lab2A Replace all code above (in this method).
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
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        *
        * getNumSearchItems() depends on the same text index as searchItems().
        * Before implementing this method, ensure that you've already created
        * a SINGLE text index on title, slogan, and description. You should
        * simply do this in the mongo shell.
        */

        //callback(numItems);
        var queryDoc;
        if (query.trim() == "")
            queryDoc = {};
        else 
            queryDoc = { "$text": {"$search": query} };  
        var cursor = this.db.collection("item").find( queryDoc ).count(function(err, numItems) {
            assert.equal(null, err);
            callback(numItems);
        });
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

        //var item = this.createDummyItem();

        // TODO-lab3 Replace all code above (in this method).
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
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    }; 

    this.getNewReviewTotal = function(dateLimit,callback) {
        "use strict";
        "use strict";
        var project = {"$project":{"_id":0}},
            group = {"$group":{"_id":"$rev","num":{"$sum":1}}},
            unwind = {"$unwind":{
                path: "$reviews",
                preserveNullAndEmptyArrays: false
            }},
            match = {"$match":{
                "reviews.date":{ "$gte":dateLimit/*1455857690000*/ } 
            } };
        console.log(dateLimit);
        this.db.collection("item").aggregate( [unwind,match,group,project]).toArray(function(err, doc) {
            assert.equal(null, err);
            if(doc.length>0)
                callback(doc[0]);
            else
                callback({"num":0})
        });
    };

    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        //var doc = this.createDummyItem();
        //doc.reviews = [reviewDoc];
        this.db.collection("item").updateOne(
            {_id: itemId},
            {"$push": {reviews: reviewDoc}},
            function(err, doc) {
                assert.equal(null, err);
                callback(doc);
            });
        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        //callback(doc);
    }


    this.createDummyItem = function() {
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
    }
}


module.exports.ItemDAO = ItemDAO;
