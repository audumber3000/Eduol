const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");


const  ausu    = require("./authentication.js");
const router = express.Router();
var cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get("/account_details/user" ,isLoggedIn, function(req,res){



User.find({username:req.user.username}, function (err, user_details) {
  if (err) return handleError(err);
res.render("user_Setting/show_user" ,{user_details:user_details})
})

});

router.get("/account_details/activity",isLoggedIn, function(req,res){

res.render("user_Setting/activity")

})

function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	  req.flash("error_msg","You need to login to access that page!")
    res.redirect("/login");
}






module.exports =router;
