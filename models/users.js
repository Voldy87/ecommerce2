function UserDAO(database) { 
    "use strict";

    this.db = database;
    
    this.getData = function(email,callback) {
        "use strict";
        callback(1,"John",true);
        /*var project = {"$project":{"category":1,"_id":0}},
            group = {"$group":{"_id":"$category","num":{"$sum":1}}},
            sort = {"$sort":{ "_id":1}};*/
        /*this.db.collection("item").aggregate( [project,group,sort]).toArray(function(err, categories) {
            assert.equal(null, err);
            var total = 0;
            for (var i=0; i<categories.length; i++)
                total += categories[i].num;
            var item = {"_id":"All", "num":total};
            categories.splice(0,0,item);
            callback(categories);
        });*/
    }

    this.getCredentials = function(email,password,callback) {
        "use strict";
        callback(true);
        
    }

}


module.exports.UserDAO = UserDAO;
/*
var UserSchema = new Schema({  
  email:  {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordSalt: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});*/