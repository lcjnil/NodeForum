var crypto = require('crypto'),
	User = require('../../../models/user.js'),
	Thread = require('../../../models/thread.js');

function get(req, res) {
	Thread.get(null, function(err, threads) {
		if (err) {
			threads = [];
		} 
		res.render('index', {
			title : 'Index',
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user,
			threads:threads
		})
	});
}

module.exports = {
	get: get
}