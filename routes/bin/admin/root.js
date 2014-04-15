var forumName = require('../../../models/forumName.js').forumName,
	forumGroup = require('../../../models/forumName.js').forumGroup;

var EventProxy = require('eventproxy');

function get(req, res) {
	forumGroup.find({}, function(err, forumGroups) {
		var ep = new EventProxy();
		var outForum = [], flag = 0;
		if (err) {
			forumGroups = [];
			ep.emit('done');
		}
		else {
			forumGroups.forEach(function(forumGroup, index) {
				forumGroup.populate('forumNames', {} , function(err, newForumGroups) {  
					outForum.push(newForumGroups);
					ep.emit('finishPop');
				});
			});
			ep.after('finishPop', forumGroups.length, function(){
				ep.emit('done');
			});
		}
		ep.all('done', function() {
			console.log(outForum);
			res.render('./admin/root', {
				title : 'Admin!',
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
				forumGroups: outForum
			});
		})
		
	});
};

module.exports = {
	get:get
}