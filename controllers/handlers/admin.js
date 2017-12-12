const os = require('os')/*, 
      mysql = require('mysql')*/; 

function createBackup(){

}

module.exports = function(dbconf) {
    "use strict";
    var ret = {};
    
    ret.sysinfo = function(req, res) {  
        "use strict";
        var cpus=os.cpus(), models=[];
        for (var i = 0; i < os.cpus().length; i++) {
            models.push(cpus[i].model);
        }
        var doc = {
            "Hostname": os.hostname(),
            "OS": os.platform() + "-" +os.type(),
            "Architecture": os.arch(),
            "CPUs": models, //array
        };
        res.send(doc);
    }; 
  

    ret.downloadBackup =  function(req, res) {
        "use strict";
         createBackup();
    }; 
    /*
    ret.saveBackup =  function(req, res) {
        "use strict";
        createBackup();
        var con = mysql.createConnection({
            host: "localhost",
            user: "yourusername",
            password: "yourpassword",
            database: "mydb"
        });
        // check last N db (see config), if N delete 1 and : zip current folder, load into db 
        //send res to jquery that in the meanwhile is showing a gif (general progress)
    };*/

    return ret;
};