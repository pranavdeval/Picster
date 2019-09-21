var express=require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");
var middleware       = require("../middleware");

router.get("/",function(req,res) {
    res.render("landing");
});
//====================================================================================
//AUTH ROUTES                                                                        |
//====================================================================================

//SHOW REGISTER FORM
router.get("/register",function(req,res) {
    res.render("register");
});

router.post("/register",function(req,res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user) {
        if(err) {
            console.log(err);
            req.flash("error",err.message);
            return res.render("register",{error: err.message});
        }
        passport.authenticate("local")(req,res,function() {
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campgrounds");
        });
         
    });
});

//SHOWS LOGIN FORM
router.get("/login",function(req,res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",{

    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to Yelpcamp!" 
}),function(req,res) {                                                                                         
});

router.get("/logout",function(req,res) {
    req.logout();
    req.flash("success","Logged You out!");
    res.redirect("/campgrounds");
});


module.exports = router;


/* 
It contains all the authentication routes!
*/