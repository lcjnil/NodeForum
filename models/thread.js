var mongoose = require('./mongoose');

var threadScheme = new mongoose.Schema({
	threadId: Number,
	author:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	firstDate:{type:Date, default:Date.now},
	lastDate:{type:Date, default:Date.now},
	forumId: Number,
	title:String,
	content:String,
	responseId: [{type: mongoose.Schema.Types.ObjectId, ref: 'response'}]
},{
	collection: 'thread'
})

var Thread = mongoose.model('thread', threadScheme);

module.exports = {
	Thread: Thread
}