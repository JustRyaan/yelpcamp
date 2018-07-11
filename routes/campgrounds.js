var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

// Index - Show All Campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

// Create - Add New Campground To DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array/db
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// New - Form To Create Campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show - Show Info On Specific Campground
router.get("/:id", function(req, res){
    // find campground with supplied ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

// Edit - Edit Campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
    
});

// Update - Update Campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    req.body.campground.description = req.sanitize(req.body.campground.description);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete - Delete Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;