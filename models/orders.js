
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function OrderDAO(database) {
    "use strict";
    
    this.db = database;

    this.getTotal = function(callback) { 
        "use strict";

        this.db.collection("order").count(function(err, count) {
                assert.equal(null, err);
                var result = {"num":count};
                callback(result);
            });

    }

}

module.exports.OrderDAO = OrderDAO;