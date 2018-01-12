var yaml = require('js-yaml'), 
    fs   = require('fs');

// Set the current environment to true in the env object
var currentEnv = process.env.NODE_ENV || 'development';

exports.currentEnv = currentEnv;

exports.appName = "UnrealMart";

exports.log = {
  path: __dirname + "/var/log/app_#{currentEnv}.log"
};  
 
exports.backup = {
  limit: 10, //how many of the most recents backups are stored in the db
  tables: [
    {"backup": "( num INT AUTO_INCREMENT PRIMARY KEY, desc VARCHAR(300), time TIME(6) NOT NULL, zip_file BLOB NOT NULL)"}
  ]
};

 
if (currentEnv != 'production') { //dev localhost parameters for dbs are hard-coded
  exports.enableTests = true;
  // Listen on all IPs in dev/test (for testing from other machines)
  exports.server = {
    ip: '0.0.0.0',
    port: 3000 //port open on localhost for the dev env 
  };
  exports.db = {
    mongo:{
      type: "dividedURL",
      scheme: 'mongodb://',
      host: "127.0.0.1",
      port:27017,
      database:exports.appName.toLowerCase()
    },
    mysql: { 
      type: "credentials",
      host: "127.0.0.1",
      user: "root",
      password: "root",
      port: 3306,
      database: exports.appName.toLowerCase()+"_bis"
    }
  }
}
else { //prod
  exports.dbcredentials = 'dbCredentials.yaml';
  exports.enableTests = false;
  // server address and port , as well as db URL and credentials, are asked at cli
} 
exports.guestId = 0; // default id of an unlogged ("guest") user
exports.itemsPerPage = 5;

//methods
function yamlDoc(path,cb){
  try {
    var doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    console.log(doc);
    cb(doc);
  } catch (e) {
    console.log(e);
  }
}

function composeURL(obj){
  return obj.scheme + obj.host + ":" + obj.port + "/" + obj.database;
}
 
exports.loadDbConfig = function(dbtype){
  var doc;
  if (currentEnv != 'production') //db credentials are hard-coded in this file
    doc = exports.db[dbtype]; 
  else { //load from external file (must be secured!)
    yamlDoc(exports.dbcredentials, function(yaml){
      doc = yaml[dbtype];
    });
  }
  console.log(doc);
  switch(doc.type){
        case "uniqueURL": return doc.url;
        case "dividedURL": return composeURL(doc);
        case "credentials": {delete doc.type; return doc;} 
  }
}

exports.getDbName = function(dbtype){
  var doc;
  if (currentEnv != 'production') //db credentials are hard-coded in this file
    doc = exports.db[dbtype]; 
  else { //load from external file (must be secured!)
    yamlDoc(exports.dbcredentials, function(yaml){
      doc = yaml[dbtype];
    });
  }
  return doc.database;
}