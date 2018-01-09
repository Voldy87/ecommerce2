//MySQL: connection on request

var mysql = require('mysql'),
	config = require('../config/config');

function BackupDAO ()  { //DAO class
	"use strict";

	function connect(config,callback) { 
		var con = mysql.createConnection({
            host: config.host,
            //port???
            user: config.user,
            password: config.password, //!! security
            database: config.database
        });
        con.connect(function(err) {
			if (err) throw err;
  			console.log("Connected to MySQL!");
  			callback(con);
		});
	}

	this.dbconfig = config.loadDbConfig("mysql"); //assume that is given that the mysql contains the backuop db
	
	this.createDbAndTables = function(callback) { //currently not used
		//..
		//var conf = config.loadDbConfig("mysql");
		connect(this.dbconfig, function(connection){
			var dbname = config.getDbName("mysql");
			connection.query("CREATE DATABASE IF NOT EXISTS "+dbname, function (err, result) {
			    if (err) 
			    	throw err;
			    console.log("Database "+dbname+" created");
			    var itemsProcessed = 0, sql;
				(conf.backup.tables).forEach((item, index, array) => {
					sql = "CREATE TABLE "+item.name+" "+item.col_dataString;
					connection.query(sql, () => { //lambda
					    itemsProcessed++;
					    if(itemsProcessed === array.length) {
					    	connection.end();
					    	callback(); //called only when all async functions are finished (order not important)
					    }
					});
				});
			 });	
		});		
	}

	this.writeOne = function(obj,callback) { //DAO method (exported)
		//var conf = config.loadDbConfig("mysql");//assume that is given that the mysql contains the backuop db
		connect(this.dbconfig, function(connection){
			var tablename = config.getDbName("mysql");
			//execute as root GRANT FILE ON *.* TO 'mysql_user'@'localhost';
			var sql = `INSERT INTO ${tablename} (desc, time, zip_file) VALUES('${obj.description}', NOW(), LOAD_FILE('${obj.path}'))`; //use string interpolation
			console.log(sql);
			connection.query(sql, function (err, result) {
			    if (err) 
			    	throw err;
			    connection.end();
			    callback();
			 });
		});
	}

	this.maxRows = config.backup.limit

	this.getRowNumber= function(callback) {
		//var conf = config.loadDbConfig("mysql"); //assume that is given that the mysql contains the backuop db
		connect(this.dbconfig, function(connection){
			var sql = 'SELECT COUNT(*) FROM' + config.getDbName("mysql"); 
			connection.query(sql, function (err, result) {
			    if (err) 
			    	throw err;
			    connection.end();
			    callback(result);
			 });
		});		//..
	}

	this.deleteOldest = function(callback)  {
		//var conf = config.loadDbConfig("mysql"); //assume that is given that the mysql contains the backuop db
		connect(this.dbconfig, function(connection){
			//var sql = DELETE....
			connection.query(sql, function (err, result) {
			    if (err) 
			    	throw err;
			    callback(result);
			 });
		});		//.. 
	}


}

module.exports.BackupDAO = BackupDAO;