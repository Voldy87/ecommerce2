module.exports = function(db,guestId) { //"exports" and "module.exports" reference the same object

    var GUEST_USERID = guestId;

    var OrderDAO = require('../../models/orders').OrderDAO;
    var order = new OrderDAO(db);

    var ret = {};
    
    ret.newTotalNumber = function(req, res) {  
        "use strict";
        //var date = parseInt(req.query.date);
        order.getTotal(function(doc) {
            res.send(doc);
        });

    };
    return ret;
}