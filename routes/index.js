var express=require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var passport = require("passport");
var middleware       = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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
    var newUser = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname:req.body.lastname,
      email: req.body.email
    });
    if(req.body.adminCode === 'secretcode123') {
        newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,function(err,user) {
        if(err) {
            console.log(err);
            req.flash("error",err.message);
            return res.render("register",{error: err.message});
        }
        passport.authenticate("local")(req,res,function() {
            req.flash("success","Welcome to Picster "+user.username);
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
    successFlash: "Welcome to Picster!" 
}),function(req,res) {                                                                                         
});

router.get("/logout",function(req,res) {
    req.logout();
    req.flash("success","Logged You out!");
    res.redirect("/campgrounds");
});

//forgot password


//USERS PROFILES

  router.get("/users/:id",function(req,res) {
    User.findById(req.params.id,function(err,foundUser) {
      if(err) {
        req.flash("error","something went wrong..");
        res.redirect("/");
      }
      else {
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err,campgrounds) {
          if(err) {
            req.flasf("error","Oops! Something went wrong!");
            res.redirect("/");
          }
          else {
            res.render("users/show",{user: foundUser, campgrounds: campgrounds});
          }
        });
      }
    });
  });



module.exports = router;


/* 
It contains all the authentication routes!
*/