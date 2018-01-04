const   os = require('os'),
        path = require('path'),
        fs = require('fs'),
        //fstream = require('fstream'),
       // archiver = require('archiver'),
        tar = require('tar'),
        zlib = require('zlib'),/*, 
      mysql = require('mysql')*/; 


function createBackup(callback){ //copies gives obvious problem with nodemon..
    var tempDir = path.join(__dirname, '../../temp/'); // mutex!!
    var readDir = path.join(__dirname, '../../');
    var archive = 'backup.tar.gz';
    fs.mkdir(tempDir,function(err){ //create temporary folder with files to save
        if (err) 
            throw err;
        fs.readdir(readDir, function(err, files) { //copy all files/dirs into temp folder..
            var filesToCopy = new Array();
            for (var i=0; i<files.length; i++) {
                if (files[i]!='temp' && files[i]!='.git' && files[i]!='node_modules') {// ..except for the temp folder itself!
                    /*var stat = fs.lstatSync(files[i]);
                    if (stat.isDirectory()) {
                        ncp(files[i], tempDir+files[i], function (err) {
                             if (err) {
                               throw err;
                             }
                        });
                    }
                    else {
                        if (stat.isFile())
                            fs.copyFile(files[i], tempDir+files[i], (err) => {
                                if (err) 
                                    throw err; 
                                
                            }) ;
                    }*/
                    filesToCopy.push(files[i]);
                   //console.log(filesToCopy);
                }
            }
 
              tar.c({},filesToCopy) // Convert the directory to a .tar file 
                .pipe(zlib.Gzip()) // Compress the .tar file 
                .pipe(fs.createWriteStream(tempDir+archive))
                //.pipe(fstream.Writer({ 'path': tempDir+archive }))
               .on('finish',function () {
                    callback({"dir": tempDir, "file": archive})
               }); // Give the output file name 
        });   
    })
   // return {"dir": tempDir, "file": archive} 
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
        createBackup(function(data){
            var archivePath = data.dir+data.file;
            console.log(archivePath);
            res.download(archivePath, 'unrealmartBackup.tar.gz',function (err) {
                fs.unlinkSync(archivePath);
                fs.rmdir(data.dir,function(err){ //clear directory
                    if (err) throw err;
                    //res.send('admin.html');
                })  
            });
        });
    }; 
    /*
    ret.saveBackup =  function(req, res) {
        "use strict";
        var data = createBackup();
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