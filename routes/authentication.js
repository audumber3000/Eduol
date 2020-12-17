//Authentication--------------------------------------------
var express = require("express");
var router = express.Router(); //changin all app.get by route.get
var passport = require("passport")
const mongoose   = require("mongoose");
var dateTime = require('node-datetime');

var cookieParser = require('cookie-parser')
var http = require('http');
const date = require('date-and-time');
var flash = require("connect-flash");
router.use(flash())


//importing all the sechma from model file
var User = require("../model/user")


router.get("/login" , function(req,res){
	res.render("login" , {CurrentUser:req.user})
})

router.post("/login",passport.authenticate("local",{

	successRedirect : "/ip-info",
	failureRedirect : "/login_failed"
}),function(req,res){

})



router.get("/login_failed" , function(req,res){
	req.flash("failed", "Error: Incorrect Credentials!")
	res.redirect("/login")
})


const user_ip_info = new mongoose.Schema({
			username:String,
			   ip:String,
				 time:String,
				 place:String,
				 seconds:String
})
const ip_info = mongoose.model('ip_info', user_ip_info);
router.get("/account_details/security_login" , function(req,res){

  ip_info.find({username:req.user.username}, function (err, ip_details) {
    if (err) return handleError(err);
    // saved!


    const ip_details_f  = ip_details.reverse();
    res.render("user_Setting/security", {ip_details:ip_details_f})
  });

});
router.get("/ip-info" , function(req,res){


var dt = dateTime.create();
var audu = dt.format('m/d/Y H:M:S');
var user_time =new Date(dt.now())
console.log(user_time);
console.log(audu);

http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
resp.on('data', function(ip) {

	ip_info.create({ username:req.user.username , ip:ip, time:user_time , place:"India"}, function (err, small) {
		 if (err) return handleError(err);
		 // saved!
	 });
   console.log("My public IP address is: " + ip);


 });
});


req.flash("success","Success : Login Successfully !");
res.redirect("/")
})




router.get("/wel",function(req, res){
res.render("welcome" , {CurrentUser:req.user})
})
router.get("/not-wel",function(req, res){
res.render("not-welcome" , {CurrentUser:req.user})
})

router.get("/incorrect-otp",function (req, res){
  res.render("incorrect-otp" , {CurrentUser:req.user})
})
//--register
router.get("/register" ,function(req,res){

	res.render("register" , {CurrentUser:req.user})
	})

router.post("/register" ,function(req,res){


   console.log(req.body.contact);
   console.log(req.body.username);
   console.log(req.body.otp);
   var user_otp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4;
   console.log(user_otp);
   //if condition satisied then only register
if(user_otp==req.body.otp){

  var newUser  = new User({username:req.body.username , contact:req.body.contact , notification:0 , age:req.body.age , city:req.body.city , college:req.body.college});

  User.register(newUser,req.body.password, function(err,user){
    console.log(newUser);
    console.log(req.body.password);
    if(err){
      console.log("smthing went wrong")
       res.render("register" , {CurrentUser:req.user})
    }


    passport.authenticate("local")(req,res,function(){
		req.flash("signup" , "Success : SignUp Successfully !")
    res.redirect("/wel")
    })
})
}
else{
  console.log("Sorry incorrect-otp")
  res.redirect("/incorrect-otp")
}

})






function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
	  req.flash("error_msg","OOPS!! Entered crediantials are Incorrect!")
    res.redirect("/login");
}


module.exports = router;
