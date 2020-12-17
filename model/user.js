var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	username: String,
	passport : String,
	contact : Number,
	notification:String,
	age:Number,
	city:String,
	college:String,
	notification :Number
});


UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User" , UserSchema);
