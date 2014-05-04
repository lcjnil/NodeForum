var crypto = require('crypto');
var	User = require('../../../models/user.js').User;

function get(req, res) {
	res.render('reg', {
		title: 'Register',
		success: req.flash('success').toString(),
		error: req.flash('error').toString(),
		user: req.session.user
	});
}
function post (req, res) {
	var password = req.body.password,
	repeatpassword = req.body.repeatpassword;
	if (repeatpassword != password) {
		req.flash('error', '两次输入的密码不一致!');
		return res.redirect('/reg');
	}
	var md5 = crypto.createHash('md5'),
	password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		userId: req.body.userId,
		password: password
	});

	User.findOne({userId:req.body.userId}, function(err, user){
		if (user) {
			req.flash('error', '用户已存在!');
			console.log('Existed!')
			return res.redirect('/reg');
		}
		newUser.save(function(err){
			if (err) {
				req.flash('error', err);
	 			return res.redirect('/reg');	
			}
	 		req.session.user = newUser;//用户信息存入 session
	 		req.flash('success', '注册成功!');
	 	    res.redirect('/');//注册成功后返回主页
		});

	});
}
module.exports = {
	get: get,
	post: post
}