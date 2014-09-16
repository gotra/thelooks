var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var genderList = {
  values: ['m','f'],
  message: 'validator failed for path `{PATH}` with value `{VALUE}` should be either m or f'
};

var colorList = {
  values: ['m','f'],
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var styleList = {
  values: ['modern','avantgrade'],
  message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};

var lengthList = {
	values: ['short','long'],
	message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
};





var ProAlbumSchema   = new Schema({
	
	gender: {type:String, enum: genderList},
	hairColor: {type:String, enum: colorList},
	hairStyle: {type:String, enum: styleList},
	hairLength: {type:String, enum: lengthList},
	imageId: String
});


module.exports = mongoose.model('proalbum', ProAlbumSchema);