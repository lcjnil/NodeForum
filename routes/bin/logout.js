var crypto = require('crypto'),
	User = require('../../models/user.js'),
	Thread = require('../../models/thread.js');

function get(req, res) {
	req.session.user = null;
	req.flash('success', '登出成功!');
	res.redirect('/');
}
module.exports = {
	get: get
}