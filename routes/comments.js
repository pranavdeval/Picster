var express=require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware       = require("../middleware");
//  =============================================================================================
//COMMENTS ROUTES
//  =============================================================================================
//NEW ROUTE - SHOWS THE FORM FOR ADDING A COMMENT TO A PARTICULAR CAMPGROUND
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        }else {
            res.render("comments/new",{campground: campground});
        }
    });
    
});

//CREATE ROUTE - CREATES A COMMENT AND ADDS IT TO A CAMPGROUND
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,campground) {
        if(err) {
            console.log(err);
        }else {
            Comment.create(req.body.comment,function(err,comment) {
                if(err) {
                    req.flash("error","Something went wrong...");
                    console.log(err);
                }else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});
//EDIT ROUTE - SHOWS A FORM TO UPDATE ANY COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res) {
    Comment.findById(req.params.comment_id,function(err,foundComment) {
        if(err) {
            res.redirect("back");
        }else {
            res.render("comments/edit",{campground_id: req.params.id,comment: foundComment});
        }
    })
});
//UPDATE ROUTE - UPDATES A COMMENT
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment) {
        if(err) {
            res.redirect("back");
        }else {
            req.flash("success","Updated comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DESTROY ROUTE - DESTROYS A COMMENT
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res) {
    Comment.findByIdAndDelete(req.params.comment_id,function(err)  {
        if(err) {
            res.redirect("back");
        }else {
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;


/*
===========================================================================
It has all the routes related to the comments                             |
===========================================================================
                                                                          |
CREATE ROUTE  - CREATS A NEW COMMENT BY ADDING IT INTO THE DATABASE       |
NEW ROUTE     - SHOWS THE NEW COMMENT FORM                                |                  
EDIT ROUTE    - SHOWS THE EDIT COMMENT FORM                               |
UPDATE ROUTE  - UPDATES A PARTICULAR COMMENT                              |
DESTROY ROUTE - DESTROYS A PARTICULAR COMMENT                             |
===========================================================================
*/