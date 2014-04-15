var mongoose = require('./mongoose');

var forumNameSchema = new mongoose.Schema({
	forumId: Number,
	name: String,
	description: String,
	parent: String,
	threadId: [Number]
},{
	collection: 'forumName'
});

var forumGroupSchema = new mongoose.Schema({
	area: String,
	forumNames:[{type: mongoose.Schema.Types.ObjectId, ref: 'forumName'}]
},{
	collection: 'forumGroup'
});


var forumName = mongoose.model('forumName', forumNameSchema);
var forumGroup = mongoose.model('forumGroup', forumGroupSchema);


module.exports = {
	forumName: forumName,
	forumGroup: forumGroup
}