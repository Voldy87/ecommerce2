module.exports = function(db,guestId) {

    var GUEST_USERID = guestId;

    var OrderDAO = require('../../models/orders').OrderDAO;
    var order = new OrderDAO(db);

    var module = {};
    
    module.newTotalNumber = function(req, res) {  
        "use strict";
        //var date = parseInt(req.query.date);
        order.getTotal(function(doc) {
            res.send(doc);
        });

    };
    return module;
}