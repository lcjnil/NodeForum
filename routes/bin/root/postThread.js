var Thread = require('../../../models/thread.js').Thread;
var ForumName = require('../../../models/forumName.js').forumName;
var markdown = require('markdown').markdown;
var EventProxy = require('eventproxy');

function post(req, res) {
	var ep = new EventProxy();
	var threadId;
	Thread.count({}, function(err, count){
		if (err) {
			req.flash('error', 'threadId ERR');
			return res.redirect('back');
		}
		threadId = count+1;
		ep.emit('count');
	});
	var currentUser = req.session.user;

	ep.all('count', function(){
		var thread = new Thread({
			author: req.session.user._id,
			forumId: req.body.forumId,
			title: req.body.title,
			content: req.body.content,
			threadId: threadId
		});
		console.log(thread);
		thread.save(function(err){
			if (err) {
				req.flash('error', 'thread SAVE ERR1');
				return res.redirect('back');
			}
			ForumName.findOne({forumId: req.body.forumId}, function(err, oneForum){
				oneForum.threadId.push(thread);
				console.log(oneForum);
				oneForum.save(function(err){
					if (err) {
						req.flash('error', 'thread SAVE ERR2');
						return res.redirect('back');
					}
					req.flash('success', 'POST SUCCESS');
					res.redirect('back');
				});
			});
		});
	})
}

function get(req, res){
	res.redirect('back');
}

module.exports = {
	post: post,
	get: get
}