var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProUserSchema   = new Schema({
	
	firstName: String,
	lastName: String,
	userId: String,  // this is to be used later to connect it with stormpath account
	imageId: String,
	emailId: String,
	website: String,
	address : {
		line1: String,
		line2: String,
		zip: String,
		city: String,
		country: String,
		state: String
	}
});


module.exports = mongoose.model('prouser', ProUserSchema);