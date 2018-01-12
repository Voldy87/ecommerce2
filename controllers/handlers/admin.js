const   os = require('os'),
        path = require('path'),
        fs = require('fs'),
        //fstream = require('fstream'),
       // archiver = require('archiver'),
        tar = require('tar'),
        zlib = require('zlib')/*, 
      mysql = require('mysql')*/; 

    //var config = require('....//config/config');
    var BackupDAO = require('../../models/backups').BackupDAO;
    var backup = new BackupDAO();

function createMongoBackup(callback){}
function createMysqlBackup(callback){}
function createFullBackup(callback){} //uses 2 aboves + 1 below and zip all


function createFileBackup(callback){ //copies gives obvious problem with nodemon..
    var tempDir = path.join(__dirname, '../../temp/'); // mutex!!
    var readDir = path.join(__dirname, '../../');
    var archive = 'backup.tar.gz';
    fs.mkdir(tempDir,function(err){ //create temporary folder with files to save
        if (err) 
            throw err; 
        fs.chmodSync(tempDir,'777');
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

module.exports = function() {
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
  

    ret.downloadBackupFiles =  function(req, res) {
        "use strict";
        createFileBackup(function(data){
            var archivePath = data.dir+data.file;
            res.download(archivePath, 'unrealmartBackup.tar.gz',function (err) {
                fs.unlinkSync(archivePath);
                fs.rmdir(data.dir,function(err){ //clear directory
                    if (err) 
                        throw err;
                })  
            });
        });
    }; 

    ret.downloadBackupDB =  function(req, res) {
        "use strict";
        //use mysqldump and mongodump, in separate funs, then zip the 2
    };     

    ret.saveBackup =  function(req, res) {
        "use strict";
        createFullBackup(function(data){
            var desc = "first backup";//descriptionString(); //backup order by USER at TIME
            var obj = {"path":data.dir+data.file, "description":desc, "table":"backup"};
            backup.getRowNumber(function(rows){
                if (backup.maxRows==rows) 
                    backup.deleteOldest(function(){ //tells remote server to delete 1 item
                        backup.writeOne(obj, function(){ //upload 1 item to remote server 
                            res.render("admin"); //jquery loadng and communicate finished
                        }); 
                    });
                else           
                    backup.writeOne(obj, function(result){ //upload 1 item to remote server
                        if (result.affectedRows!=1)
                            res.render("error.hbs")
                        else
                            res.render("admin");
                    });
            });
        });

        
        // check last N db (see config), if N delete 1 and : zip current folder, load into db 
        //send res to jquery that in the meanwhile is showing a gif (general progress)
    };

    return ret;
};