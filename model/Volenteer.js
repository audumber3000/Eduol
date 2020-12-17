var mongoose = require("mongoose");


var VolenteerSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
  college:String,
	state:String,
	city:String,
	address:String,
	zip:Number



});


module.exports = mongoose.model("Volenteer" , VolenteerSchema);
