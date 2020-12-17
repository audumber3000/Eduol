const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");
const router = express.Router();
const  cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get("/notes/notes_store", function(req, res){

notes.find(function (err, all_notes) {
          if (err) return handleError(err);
          console.log(all_notes);
          res.render("notes/notes_store" , {CurrentUser:req.user , all_notes:all_notes});
        });


});

router.post("/notes/notes_store",isLoggedIn, function(req, res){
  notes.findById({_id:req.body.id}, function (err, one_detail) {
          if (err){
            console.log("something went wrong!!!")
          }else{
            console.log(req.body.id);
            console.log(one_detail);
          res.cookie("cost" , one_detail);
          res.render("notes/check_out" , {CurrentUser:req.user , one_detail:one_detail});
          }
  });

});

router.get("/notes/check_out",isLoggedIn, function(req, res){
  res.render("notes/check_out" , {CurrentUser:req.user});

});



router.get("/notes/sell_notes",isLoggedIn, function(req, res){
    res.render("notes/sell_notes" , {CurrentUser:req.user});
});
router.get("/notes/notes_details",isLoggedIn, function(req, res){
    res.render("notes/notes_details" , {CurrentUser:req.user});
});

router.post("/notes/notes_details",isLoggedIn, function(req, res){
  console.log(req.body.id)
  notes.find({_id:req.body.id}, function (err, notes_det) {
          if (err){
            console.log("something went wrong!!!")
          }else{
          res.render("notes/notes_details" , {CurrentUser:req.user , notes_det:notes_det});
          }
});

});



var NotesSchema = new mongoose.Schema({
	Name:String,
	Subject:String,
	city:String,
	college:String,
  paid:String,
  username:String,
  pages:String,
  cost:Number,
  class:String

});

const notes = mongoose.model('notes', NotesSchema);
router.post("/post-notes" , isLoggedIn , function(req,err,res){

  var datetime = new Date();
  var date = datetime.toISOString().slice(0,10);
console.log(req.body.paid)
notes.create({ username:req.body.username , Name:req.body.fname,Subject:req.body.subject ,city:req.body.city, college:req.body.college, paid:req.body.paid , pages:req.body.pages, cost:req.body.cost,class:req.body.class}, function (err, small) {
      console.log(small)
      if (err){
        console.log("somthing went wrong!!")
      }

    });
console.log("notes pushed successfully")
res.redirect("/notes/notes_store");
});


function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	req.flash("error_msg","You need to login to access that page!")
    res.redirect("/login");
}

module.exports  = router;
