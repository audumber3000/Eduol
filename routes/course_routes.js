const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");
const router = express.Router();
var Chart = require('chart.js');
var cookieParser = require('cookie-parser')
router.use(cookieParser())





const questions = new mongoose.Schema({
   question:String,
   topic:String,
   concept:  String,
   options:[String],
   answers:String

 });
const questions_en = mongoose.model('questions_en', questions);

router.get("/courses/engineering/upload_que" , function(err,res){
  res.render("courses/engineering/upload_que")

});

router.post("/courses/engineering/questions" , function(req,err,res){
   questions_en.create({question:req.body.q,topic:"java",concept:"",options:[req.body.opt1 , req.body.opt2, req.body.opt3, req.body.opt4],answers:req.body.ans }, function (err, auu) {
     if (err) return handleError(err);
     // saved!
   });

   console.log("interseted successfully!")
 })


router.get("/courses/class11-12", function(req, res){
    res.render("courses/class11-12" , {CurrentUser:req.user});
});




router.post("/courses/engineering/ds", function(req, res){
	console.log(req.body.sub);
    res.cookie("sub" , req.body.sub);
	
   questions_en.find({topic:req.body.sub }, function (err, data) {
    if (err) return handleError(err);
    
    let audum = [];
    for(let i=0;i<data.length;i++){
      audum[i] = data[i].answers;
    }

  console.log(audum)
    res.render("courses/engineering/ds", {CurrentUser:req.user , data:data ,answers:audum});
  });

});

router.post("/courses/engineering/loading",function(req,res){
  console.log(req.body.answer);
let sub = req.cookies.sub;

  questions_en.find({topic:sub }, function (err, data1) {
     let perfect_ans = [];
     for(let i=0;i<data1.length;i++){
       perfect_ans[i] = data1[i].answers;
     }

     console.log("perfect ans: " + perfect_ans);
       let new_ans = req.body.answer.split(",").join("")
       let tf = [];

       let rit = 0;
       let wrong = 0;
       for(let i=0; i<perfect_ans.length; i++){
          if(perfect_ans[i]==new_ans[i]){
           tf[i]="true";
           rit = rit+1;
         }else{
           tf[i]="false";
           wrong = wrong+1;
         }
       }

       res.cookie("rit" , rit);
       res.cookie("wrong" , wrong);
       res.cookie("tf", tf);



       res.render("courses/engineering/loading");

});



});

router.post("/courses/engineering/dashboard", function(req, res){

let rit = req.cookies.rit;
let wrong = req.cookies.wrong;
let tf = req.cookies.tf;
let sub = req.cookies.sub;

	console.log("hey man god is with you")
questions_en.find({topic:sub }, function (err, data) {
	
if (err) return handleError(err);
console.log(data);
res.render("courses/engineering/dashboard" , {cor:rit , incor:wrong , tf:tf , data:data})
});



});



router.get("/courses/engineering", function(req, res){
  console.log("audumber")
    res.render("courses/engineering/engineering", {CurrentUser:req.user});
});

router.get("/courses/engineering/dashboard", function(req, res){
  console.log("audumber")
    res.render("courses/engineering/dashboard", {CurrentUser:req.user});
});

//---------------------------------------------------------------------
router.get("/courses/medical", function(req, res){
    res.render("courses/medical" , {CurrentUser:req.user});
});
router.get("/assistance/volenteer", function(req, res){
    res.render("assistance/volenteer" , {CurrentUser:req.user});
});
router.get("/courses/neet", function(req, res){
    res.render("courses/neet" , {CurrentUser:req.user});
});
router.get("/courses/jee", function(req, res){
    res.render("courses/jee" , {CurrentUser:req.user});
});


const chapters = new mongoose.Schema({
   cls:String,
   subject:  String, // String is shorthand for {type: String}
   chapters: [String],
   links:[String]


 });


const chap = mongoose.model('chap', chapters);

// app.post("/tak" , function(err,res){
//   chap.create({ cls:"class-12",subject:"Maths",
//       chapters:["Chapter 1 :Relations and Functions",
// "Chapter 2 :Algebra",
// "Chapter 3 :Calculus",
// "Chapter 4 :Vectors and Three – Dimensional Geometry",
// "Chapter 5 :Linear Programming",
// "Chapter 6 :Probability"],links:[]}, function (err, small) {
//     if (err) return handleError(err);
//     // saved!
//   });
//
//   console.log("interseted successfully!")
// })


//--getting syllabus
router.get("/courses/syllabus", function(req, res){
res.render("courses/syllabus"  , {CurrentUser:req.user});
});

router.post("/courses/syllabus" , function(req,res){
  var cls_val = req.body.cls
  var subject_val = req.body.subject

  chap.find({ 'cls': cls_val , 'subject': subject_val }, function (err, chap) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".

    res.render("courses/syllabus" , {CurrentUser:req.user , chap:chap})
  });

})


router.get("/offer" , function(req,res){

	res.render("offer" , {CurrentUser:req.user})
})



module.exports =router;
