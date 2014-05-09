/*
	GET /forum/:forumName
*/

var ForumName = require('../../../models/forumName.js').forumName;
var EventProxy = require('eventproxy');

function get(req, res) {
	ForumName.findOne({name: req.params.forumName}, function(err, forum){
		var ep = new EventProxy();
		if (err||!forum) {
			console.log('There is no such forum');
			req.flash('err', 'NO SUCH FORUM')
			return res.redirect('back');
		}
		//console.log(forum);
		forumInfor = {
			forumId: forum.forumId,
			forumName: forum.name
		}
		forum.populate('threadId', {}, function(err, newForum) {
			if (err) {
				req.flash('error', err);
			}
			ep.emit('threadPopulated', newForum.threadId);
		});

		//remains to be modifier
		ep.all('threadPopulated', function(threadId){
			threadId.forEach(function(thread){
				thread.populate('author', {}, function(err, newThread){
					console.log(newThread);
					ep.emit('authorPopulate', newThread);
				});
			});
			if (threadId.length==0){
				ep.emit('done');
			}
		})
		ep.after('authorPopulate', forum.threadId.length-1, function(newThread){
			ep.emit('done', newThread);
		});
		ep.all('done', function(newThread){
			if (!newThread) newThread = [];
			res.render('./forum', {
				title : req.params.forumName,
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
				threads: newThread,
				forum: forumInfor
			});
		})
	});
}

module.exports = {
	get: get
}