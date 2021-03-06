var crypto = require('crypto');
var User = require('../../../models/user.js').User;

function post(req, res) {
	if (req.body.userId.length==0) {
		req.flash('error', '用户名为空');
		return res.redirect('/');
	}
	if (req.body.password.length==0) {
		req.flash('error', '密码为空');
		return res.redirect('/');
	}
	var md5 = crypto.createHash('md5'), 
	password = md5.update(req.body.password).digest('hex');

	User.findOne({userId: req.body.userId}, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在!'); 
			return res.redirect('back');
		}
		if (user.password != password) {
			req.flash('error', '密码错误!'); 
			return res.redirect('back');
		}
		req.session.user = user;
		req.flash('success', '登陆成功!');
		return res.redirect('/');
	})
}
function get(req, res){
	res.redirect('back');
}

module.exports = {
	post: post,
	get: get
}