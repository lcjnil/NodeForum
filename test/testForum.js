var forumName = require('../models/forumName.js').forumName,
	forumGroup = require('../models/forumName.js').forumGroup;

var f1 = new forumName({
	forumId: 1,
	name: "AAAA",
	description: "BBBB"
});
f1.save();

var g1 = new forumGroup({
	area:"TESTAREA",
	groupId:1
});
g1.save();

forumGroup.findOne({area:"TESTAREA"}, function(err, oneForumGroup) {
	if (err) {
		console.log(err);
	}
	else {
		console.log(oneForumGroup);
		oneForumGroup.forumNames.push(f1._id);
		oneForumGroup.save();
		f1.parent = oneForumGroup._id;
		f1.save();
	}
});
