// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Sorry, the requested campground could not be found.");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Hands off! Campground does not belong to you.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/campgrounds/" + req.params.id);
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Hands off! Comment does not belong to you.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;