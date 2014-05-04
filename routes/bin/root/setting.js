var crypto = require('crypto');
var User = require('../../../models/user.js').User;

function get(req, res) {
	res.render('setting', {
		title: 'setting',
		success: req.flash('success').toString(),
		error: req.flash('error').toString(),
		user: req.session.user
	})
}

function post(req, res) {
	var update = {};
	var password = req.body.password,
	repeatpassword = req.body.repeatpassword;
	if (req.body.password){
		if (repeatpassword != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
		update.password = password;
	}
	if (req.body.nickname){
		update.nickname = req.body.nickname;
	}
	if (req.body.email) {
		update.email = req.body.email;
	}
	if (req.body.qq) {
		update.qq = req.body.qq;
	}
	if (req.body.github) {
		update.github = req.body.github;
	}
	if (req.body.grade) {
		update.grade = req.body.grade;
	}
	if (req.body.description) {
		update.description = req.body.description;
	}
	console.log(update);
	User.findOne({userId:req.session.user.userId}, function(err, user){
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		user.information = mergeObject(user.information, update);	
		user.save(function(err){
			if (err){
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('error', "REFRESHED!");
			return res.redirect('/');
		});
	});
}

module.exports = {
	post: post,
	get: get
}

function mergeObject(obj1,obj2){
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { if (obj2[attrname]) obj3[attrname] = obj2[attrname]; }
	return obj3;
}