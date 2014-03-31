var mongoose = require('./mongoose');

var UserSchema = new mongoose.Schema({
	"userId": String,
	"password": String,
	"information": {
		"nickname":String,
		"email": String,
		"qq": String,
		"github": String,
		"grade":String
	},
	"class": {type:String, default:"member"},
	"level": Number,
	"regTime": {type:Date, default:Date.now},
	"following": [Number],
	"follower": [String],
	"message": [
		{
			"title": String,
			"content": String,
			"userId": String
		},
	],
	"invitation":[String],
	"invitedBy": String,
	"favoriteThread":[Number],
	"thread": [Number]
},{
	collection:'user'
})

var User = mongoose.model('user', UserSchema);

module.exports = User;