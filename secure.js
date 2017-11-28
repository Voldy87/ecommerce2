var crypto = require('crypto')/*, 
	argon2 = require('argon2')*/;


function SecurityWithHash() {
	    "use strict";
	/**
	 * generates random string of characters i.e salt
	 * @function
	 * @param {number} length - Length of the random string.
	 */
	var generateSalt = function(length){
	    return crypto.randomBytes(Math.ceil(length/2))
	            .toString('hex') /** convert to hexadecimal format */
	            .slice(0,length);   /** return required number of characters */
	};
	this.createCredentials = function (userpassword, algorithm, callback) {
		switch(algorithm){
			/*case "argon2":{
	    		const options = {
					  timeCost: 4, 
					  memoryCost: 13, 
					  parallelism: 2, 
					  type: argon2.argon2id
				};
	    		argon2.hash(userpassword, options)
	    			.then(hash => {
						return callback(null, hash.toString('hex'),null);
					}).catch(err => {
						return callback(err);
					});
				break;
			}*/
			case "pbkf2": {
			    crypto.pbkdf2(userpassword, generateSalt(64), 10000, 512, 'sha512', function(err, derivedKey) {
			      	if (err) 
			      		return callback(err);
					else
						return callback(null, derivedKey.toString('hex'),salt);
				});					
				break;
			}

		}

	}
		


	}

	this.checkCredentials = function (hashedPassword, insertedPassword, algorithm, callback) {
		switch(algorithm){
		/*	case "argon2":{
					var method = {
						algorithm: "argon2",
						timeCost: 4, 
						memoryCost: 13, 
						parallelism: 2,
						type: argon2.argon2id,
					}; 
					argon2.verify(hashedPassword, insertedPassword)
						.then(match => { 
							callback(null,match); 
						})
						.catch(err => {
  						// internal failure 
  						});
					break;
			}*/	
			case "pbkf2": {
					var method = {
						algorithm : "pbkdf2",
						salt : generateSalt(64), 
						iterations: 100000,
						len : 512,
						digest : 'sha512'
					}; 
					crypto.pbkdf2(userpassword, salt, 10000, userpassword.length, 'sha512', function(err, derivedKey) {
				      	if (err) 
				      		return callback(err);
						else
							return callback( null, (derivedKey.toString('hex')==insertedPassword) );
					});
					break;
			}
		}
		
		

}



	

module.exports.SecurityWithHash = SecurityWithHash;
