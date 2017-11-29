 //handle users sign in, up, out 

    exports.signupLanding =  function(req, res) {
        "use strict";
        //app.set('view engine', 'pug')
        res.render('login.pug',{ title: 'Login Page @UnrealMart', flash: req.flash()});           
    };
 
    exports.signupSend = function(req,res){
        if (req.body.email && req.body.email === 'user' && req.body.password && req.body.password === 'pass') {
            req.session.logged = true;
            req.session.email = req.body.email;
            res.redirect('/');
        } else {
            req.flash('error', 'Email and password are incorrect');
            res.redirect('/login');
        }    
    };

    exports.signout = function(req,res){
        req.session.destroy(function(err) {
            if(err)
                console.log(err);
            else 
                res.redirect('/');
        });
    };    

    exports.signinLanding = function(req,res){
        res.render('register.ejs',{ title: 'Creating your UnrealMart account..'});
    };

    exports.signinSend = function(req,res){

    };/**/