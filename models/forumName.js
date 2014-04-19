var mongoose = require('./mongoose');

var forumNameSchema = new mongoose.Schema({
	forumId: Number,
	name: String,
	description: String,
	parent: {type: mongoose.Schema.Types.ObjectId, ref: 'forumGroup'},
	threadId: [Number]
},{
	collection: 'forumName'
});

var forumGroupSchema = new mongoose.Schema({
	area: String,
	groupId: Number,
	forumNames:[{type: mongoose.Schema.Types.ObjectId, ref: 'forumName'}]
},{
	collection: 'forumGroup'
});


var forumName = mongoose.model('forumName', forumNameSchema);
var forumGroup = mongoose.model('forumGroup', forumGroupSchema);


module.exports = {
	forumName: forumName,
	forumGroup: forumGroup
};
