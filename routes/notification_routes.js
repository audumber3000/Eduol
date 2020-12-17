const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");
const router = express.Router();
var cookieParser = require('cookie-parser')
router.use(cookieParser())
var flash = require("connect-flash");
router.use(flash())

const Notification = new mongoose.Schema({
   to_username:String,
   notification:  String, // String is shorthand for {type: String}
   from_username: String, // String
   status : String,
   time:String

  });

//push new notification for welcome:-----------
const notification = mongoose.model('notification', Notification);
router.post("/post-notification-wel" , function(req,res){

  //it will increase the number of notification in users record.
User.updateMany({username:req.body.to_username}, {$inc: {"notification": 1}},function(err,users){
  	if(err){
  		console.log("smthing went wrong!!!")
    }
    console.log("updated successfully")
  	});


console.log(req.body.to_username);

  var datetime = new Date();
  var date = datetime.toISOString().slice(0,10);

if(req.body.noti_type == "welcome"){
  notification.create({ to_username:req.body.to_username,notification:"Hey " +req.body.to_username + " Welcome to Eduol App" , status:"unread" , time:date}, function (err, small , res) {
        if (err){
          console.log("went wrong !!")
        }

      });
}

console.log("notification sent successfully!")
res.redirect("/");
})


//push notification for notes buy and view--------
router.post("/post-notification-notes" , function(req,res){

    //it will increase the number of notification in users record.
    User.updateMany({username:req.body.to_username}, {$inc: {"notification": 1}},function(err,users){
    	if(err){
    		console.log("smthing went wrong!!!")
      }
      console.log("updated successfully")
    	});


    console.log("to_username: " + req.body.to_username);
    console.log("from_usernam : " + req.body.from_username);
    var datetime = new Date();
    var date = datetime.toISOString().slice(0,10);

  if(req.body.noti_type == "buy_notes"){
    notification.create({ to_username:req.body.to_username,notification:req.body.from_username+" want to buy your Notes" , from_username:req.body.username, status:"unread" , time:date}, function (err, small,res) {
          if (err){
            console.log("somthinfg went wrong!!!")
          };
        });
}
    console.log("notification sent successfully!")
      res.redirect("/payment/paytm_checkout");
    })




//push notification for notes buy and view--------
    router.post("/post-notification-view_notes" , function(req,res){

        //it will increase the number of notification in users record.
        User.updateMany({username:req.body.to_username}, {$inc: {"notification": 1}},function(err,users){
        	if(err){
        		console.log("smthing went wrong!!!")
          }
          console.log("updated successfully")
        	});


        console.log("to_username: " + req.body.to_username);
        console.log("from_usernam : " + req.body.from_username);
        var datetime = new Date();
        var date = datetime.toISOString().slice(0,10);

       if(req.body.noti_type == "view_notes"){
        notification.create({ to_username:req.body.to_username, notification:req.body.from_username + " viewed your Notes Details!" , from_username:req.body.from_username, status:"unread" , time:date}, function (err, small,res) {
              if(err){
                console.log("something went wrong!!")
              }
            });
      }
         console.log("notification sent successfully!")
          res.redirect("notes/notes_store");
        })



//find the notification:-----------
router.post("/all-notification", function(req,res){

res.cookie("username" , req.body.user);//cookie sending username
function show_notification(callback) {

  notification.find({ to_username:req.body.user}, function (err, all_noti) {
          if (err) return handleError(err);
          var all_noti1 = all_noti.reverse();
         return callback(all_noti1)
               });

        console.log("audumber is great!")
}

  show_notification(function(response){
  var audu = response;
  console.log(audu);
  res.render("notification/notify_page" , {CurrentUser:req.user , notification:audu});
});

})


router.get("/notification-clear_all", function(req,res){


console.log(req.cookies.username)

  User.updateMany({username:req.cookies.username},{"notification": 0},function(err,users){
    	if(err){
    		console.log("smthing went wrong!!!")
      }
      console.log("updated successfully")
    	});


  notification.deleteMany({ to_username:req.cookies.username}, function (err) {
          if(err) console.log(err);
          console.log("Successful deletion");
        });


console.log("audumber is great!")

req.flash("clear" , "Clear : All Notifications Clear !")
res.redirect("/");


})



module.exports =router;
