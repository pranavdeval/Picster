var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
    {
        name: "Shimla",
        image: "https://images.unsplash.com/photo-1489933504786-389c51eb1b7f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget magna fermentum iaculis eu non. Maecenas volutpat blandit aliquam etiam erat. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Arcu cursus euismod quis viverra nibh cras. Aliquet nibh praesent tristique magna sit. Nunc vel risus commodo viverra maecenas accumsan lacus. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. In hac habitasse platea dictumst vestibulum. Maecenas ultricies mi eget mauris pharetra et ultrices."
    },
    {
        name: "Manali",
        image: "https://images.unsplash.com/flagged/photo-1560993134-018c467d900d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget magna fermentum iaculis eu non. Maecenas volutpat blandit aliquam etiam erat. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Arcu cursus euismod quis viverra nibh cras. Aliquet nibh praesent tristique magna sit. Nunc vel risus commodo viverra maecenas accumsan lacus. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. In hac habitasse platea dictumst vestibulum. Maecenas ultricies mi eget mauris pharetra et ultrices."
    },
    {
        name: "Ooty",
        image: "https://images.unsplash.com/photo-1563524731987-f6d09bbfca2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1100&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget magna fermentum iaculis eu non. Maecenas volutpat blandit aliquam etiam erat. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Arcu cursus euismod quis viverra nibh cras. Aliquet nibh praesent tristique magna sit. Nunc vel risus commodo viverra maecenas accumsan lacus. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. In hac habitasse platea dictumst vestibulum. Maecenas ultricies mi eget mauris pharetra et ultrices."
    }
]
function seedDB() {
    //REMOVE ALL CAMPGROUNDS
    Campground.remove({},function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Removed campgrounds");
        data.forEach(function(seed) {
            Campground.create(seed,function(err,campground) {
                if(err) {
                    console.log(err);
                }else {
                    console.log("added a campground!");

                    //create a comment
                    Comment.create(
                        {
                            text: "This place is grea,but i wish there was internet",
                            author: "Nene"
                        },function(err,comment) {
                            if(err) {
                                console.log(err);
                            }else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created a new comment");
                            }
                        }
                    );
                }
            });
        });
    });
}


module.exports = seedDB;