var express          =require("express");
var app              =express();
var bodyParser       =require("body-parser");
var mongoose         =require("mongoose");
var passport         =require("passport");
var localStrategy    =require("passport-local");
var methodOverride   =require("method-override");
var flash            =require("connect-flash");
var Campground       = require("./models/campground");
var Comment          = require("./models/comment");
var User             = require("./models/user");
var seedDB           = require("./seed");


var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes    = require("./routes/comments");
var indexRoutes       = require("./routes/index");


// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://pranavdeval:Adilabad1@cluster0-onhsi.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useCreateIndex: true
}).then( function() {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:",err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))    //  __dirname indiacates the current directory
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.locals.moment = require("moment");
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "We can write anything here!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


//app.listen(process.env.PORT,process.env.IP,function(){
 //   console.log("YelpCamp server has started...!!!");
//});


 app.listen(3000,"127.0.0.1",function(){
      console.log("YelpCamp server has started...!!!");
  });