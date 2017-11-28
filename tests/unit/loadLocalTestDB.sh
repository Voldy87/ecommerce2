mkdir /localTestingDBdata
mongo --dbpath /localTestingDBdata --port 27018
mongoimport --port 27018 --drop -d unrealmartTestDB -c products data/products.json
mongoimport --port 27018 --drop -d unrealmartTestDB -c carts data/carts.json
mongoimport --port 27018 --drop -d unrealmartTestDB -c users data/users.json