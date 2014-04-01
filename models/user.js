var mongoose = require('./mongoose');

var MessageSchema = new mongoose.Schema({
	title: String,
	content: String,
	userId: String
});

var UserSchema = new mongoose.Schema({
	userId: String,
	password: String,
	information: {
		nickname:String,
		email: String,
		qq: String,
		github: String,
		grade:String
	},
	class: {type:String, default:"member"},
	level: Number,
	regTime: {type:Date, default:Date.now},
	following: [Number],
	follower: [String],
	message: [MessageSchema],
	invitation:[String],
	invitedBy: String,
	favoriteThread:[Number],
	thread: [Number]
},{
	collection:'user'
})

var User = mongoose.model('user', UserSchema);
var Message = mongoose.model('message', MessageSchema);

module.exports = {
	User: User,
	Message: Message
};