var crypto = require('crypto'),
	User = require('../../models/user.js'),
	Thread = require('../../models/thread.js');

function post(req, res) {
	var currentUser = req.session.user;
	console.log(currentUser);
	var thread = new Thread(req.body.title, req.body.content, currentUser.userId);
	thread.save(function(err){
		if (err) {
			req.flash('error', err);
			return res.redirect('/post');
		}
		req.flash('success', '发布成功!');
		res.redirect('/');
	});
};

module.exports = {
	post: post
}