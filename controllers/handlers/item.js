module.exports = function(db,guestId) {

    var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    readChunk = require('read-chunk')
    formidable = require('formidable'),
    fileType = require('file-type'),
    bodyParser = require('body-parser'); //can i put all in root file???
    var app = express(); 
 /*app.use(bodyParser.urlencoded({
    extended: true
}));*/app.use(bodyParser.json({uploadDir:'./'}));


    var moment = require('moment');

    var GUEST_USERID = guestId;
    var ItemDAO = require('../../models/item').ItemDAO;
    var items = new ItemDAO(db);

    var module = {};

    function getCategoryNames(categories){
        var getId = (acc, curr) => acc.concat(curr["_id"]);
        var categoryNames = categories.reduce(getId,[]);
        var index = categoryNames.indexOf("All"); //indexOf is not supported in IE7/8
        if (typeof index != 'undefined')
            categoryNames.splice(index,1);
        return categoryNames;
    }

    module.view =  function(req, res) {
        "use strict";

        var itemId = parseInt(req.params.itemId);

        items.getItem(itemId, function(item) {

            if (item == null) {
                res.status(404).send("Item not found.");
                return;
            }
             
            var stars = 0;
            var numReviews = 0;
            var reviews = [];
            
            if ("reviews" in item) {
                numReviews = item.reviews.length;

                for (var i=0; i<numReviews; i++) {
                    var review = item.reviews[i];

                    review.date = moment(review.date).format('llll'); // Tue, Nov 28, 2017 11:25 AM;//review.date.toString();
                    
                    stars += review.stars;
                }

                if (numReviews > 0) {
                    stars = stars / numReviews;
                    reviews = item.reviews;
                }
            }

            items.getRelatedItems(function(relatedItems) {

                res.render("item", {
                    logged: req.session.logged,
                    user: req.session.user,
                    userId: GUEST_USERID,
                    item: item,
                    stars: stars,
                    reviews: reviews,
                    numReviews: numReviews,
                    relatedItems: relatedItems
                });
            });
        });
    };

    module.allNames = function(req, res) {
        "use strict";
        var data = new Object();

        items.getItems("All", 0, 0, function(objects) {
            data["product_names"] = objects.reduce( (acc, curr) => acc.concat(curr["title"]) , [] );
            res.send( data ); //call item dao for category select
        });   
    };

    module.insertAction = function(req, res) {
        "use strict";
       // var data = req.body;
       //console.log(req);res.redirect("../../static/pages/newItem.html")
   /* var tempPath = req.files.image.path,
        targetPath = path.resolve('./uploads/image.png');
    if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png files are allowed!");
        });
    }*/
        // fs MKDIR + cb
        var form = new formidable.IncomingForm();
        var uploadDir = path.join(__dirname, '../../temp/');
        fs.mkdirSync(uploadDir);
        form.uploadDir = uploadDir;
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        form.parse(req, function(err, fields, files) {//fields is an object containing all your fields, file is an object containing properties of your uploaded file
            var filePath = files.image.path;
            const buffer = readChunk.sync(filePath, 0, 4100);
            var fileName = fields.name + "." + fileType(buffer).ext; //add file extension (for Windows platforms)
            fileName = fileName.replace(/ /g,"-").toLowerCase();
            var newPath = path.join(__dirname,'../../static/img/products/',fileName); //parametrizza
            fs.rename(filePath, newPath, function(err){
                /*var img_url =; 
                var data = {
                    "title":fields.name,
                    "slogan": fields.slogan,
                    "description": fields.description,
                    "category":fields.category,
                    "price": fields.price,
                    "img_url": img_url
                };*/
                if (err) throw err;
                var reviewsNum = fields.reviewsNum;
                var reviewsParts = new Array();
                for (var i=0;i<reviewsNum;i++)
                    reviewsParts.push(new Object());
                var revreField = /^comment|username|stars/g,
                    revreIndex = new RegExp(/^(?:comment|username|stars)(\d{1,})$/,'i');
                for (var prop in fields){
                    //console.log(prop);
                    if (prop.search(revreField)!=-1){ //a field of a review (usernameX, commentX, starsX)
                        var key = prop.match(revreField)[0]; //e.g. "username" in "username3"
                        var pos = parseInt(prop.match(revreIndex)[1]); //e.g. 2 in "comment2"   
                        console.log(pos);
                        console.log(reviewsNum);
                        console.log(reviewsParts);
                       if (key=="username")
                            key="name";
                        reviewsParts[pos-1][key] = fields[prop]; console.log(reviewsParts);
                    }
                } 
 
                var date = Date.now();
                reviewsParts.map( x => x["date"]=date);
            console.log(reviewsParts);
                items.insertOne(
                    fields.name, //title
                    fields.slogan,
                    fields.price,
                    fields.description,
                    fields.category,
                    "/img/products/"+fileName, //img_url
                    reviewsParts, 
                    function(outcome) {
                        fs.rmdir(uploadDir,function(err){
                            items.getCategories(function(categories) {
                                var categoryNames = getCategoryNames(categories);
                                let obj = {
                                    "categories": categoryNames,
                                    "product": outcome
                                }
                                res.render("newItem",obj);
                            });  
                        })       
                    }
                );
            });
        });
    };

    module.insertForm = function(req, res) {
        "use strict";
        items.getCategories(function(categories) {
            var categoryNames = getCategoryNames(categories);
            let obj = {
                "categories": categoryNames,
               // "product": {}
            }
            console.log(categoryNames); console.log(obj);
            res.render("newItem",obj); //call item dao for category select
        });   
    };

   module.comment = function(req, res) {
        "use strict";
        var itemId = parseInt(req.params.itemId);
        var review = req.body.review;
        var name = req.body.name;
        var stars = parseInt(req.body.stars);
        items.addReview(itemId, review, name, stars, function(itemDoc) {
            res.redirect("/item/" + itemId);
        });
    };

   module.newCommentsNumber = function(req, res) {
        "use strict";
        var date = parseInt(req.query.date);
        items.getNewReviewTotal(date, function(doc) {
            res.send(doc);
        });
    };

                
return module;
};