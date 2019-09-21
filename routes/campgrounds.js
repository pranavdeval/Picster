var express          = require("express");
var router           = express.Router();
var Campground       = require("../models/campground");
var Comment          = require("../models/comment");
var middleware       = require("../middleware");       //middleware is an object which has middleware functions in it!

//INDEX ROUTE - DISPLAYS ALL THE CAMPGROUNDS
router.get("/campgrounds",function(req,res) {
    Campground.find({},function(err,allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});
//CREATE ROUTE - CREATS A NEW CAMPGROUND BY ADDING IT INTO THE DATABASE
router.post("/campgrounds",middleware.isLoggedIn,function(req,res) {
    var name=req.body.name;      //name is the name attribute in the input tags of new.ejs
    var image=req.body.image;    //image is the name attribute in the input tags of new.ejs
    var desc=req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds={name:name,price: price,image:image,description: desc,author: author};    //name(campgroundSchema):name(local variable)
    Campground.create(newCampgrounds,function(err,newlyCreated) {
        if(err) {
            console.log(err);
        }else {
            req.flash("success","Successfully created a campground!");
            res.redirect("/campgrounds");      //redirect() default is get request 
        }
    });

});
//NEW ROUTE - SHOWS THE NEW CAMPGROUND FORM
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res) {
    res.render("campgrounds/new");
});
//SHOW ROUTE - SHOWS INFO ABOUT ONE SPECIFIC CAMPGROUND
router.get("/campgrounds/:id",function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) {
        if(err) {
            console.log(err);
        }else {
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
  
});

//EDIT ROUTE - SHOWS THE EDIT CAMPGROUND FORM
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res) {
    Campground.findById(req.params.id,function(err,foundCampground) {
        res.render("campgrounds/edit",{campground: foundCampground});
    }); 
});
//UPDATE ROUTE - UPDATES A PARTICULAR CAMPGROUND
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res) {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground) {
        if(err) {
            console.log(err);
        }else {
            req.flash("success","Updated campground succesfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
//DESTROY ROUTE - DESTROYS A PARTICULAR CAMPGROUND
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res) {
    Campground.findByIdAndDelete(req.params.id,function(err) {
        if(err) {
            console.log(err);
        }else {
            req.flash("success","Deleted campground succesfully!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;

/*
===========================================================================
It has all the routes related to the campgrounds                          |
===========================================================================
INDEX ROUTE   - DISPLAYS ALL THE CAMPGROUNDS                              |
CREATE ROUTE  - CREATS A NEW CAMPGROUND BY ADDING IT INTO THE DATABASE    |
NEW ROUTE     - SHOWS THE NEW CAMPGROUND FORM                             |
SHOW ROUTE    - SHOWS INFO ABOUT ONE SPECIFIC CAMPGROUND                  |
EDIT ROUTE    - SHOWS THE EDIT CAMPGROUND FORM                            |
UPDATE ROUTE  - UPDATES A PARTICULAR CAMPGROUND                           |
DESTROY ROUTE - DESTROYS A PARTICULAR CAMPGROUND                          |
===========================================================================
*/