// Set the current environment to true in the env object
var currentEnv = process.env.NODE_ENV || 'development';
exports.currentEnv = currentEnv;

exports.appName = "UnrealMart";
/*exports.env = {
  production: false,
  development: false
};  
exports.env[currentEnv] = true;*/
exports.log = {
  path: __dirname + "/var/log/app_#{currentEnv}.log"
};  
exports.server = {
  port: 9600,
  // In staging and production, listen loopback. nginx listens on the network.
  ip: '127.0.0.1'
};  
if (currentEnv != 'production') {
  exports.enableTests = true;
  // Listen on all IPs in dev/test (for testing from other machines)
  exports.server = {
    ip: '0.0.0.0',
    port: 3000 //port open on localhost for the dev env 
  };
  exports.db = {
    host: "127.0.0.1",
    port:27017,
    name:exports.appName.toLowerCase()
  };
}
else { //dev
  exports.enableTests = false;
  // server address and port , as well as db URL and credentials, are asked at cli
} 
exports.guestId = 0; // default id of an unlogged ("guest") user
exports.itemsPerPage = 5;