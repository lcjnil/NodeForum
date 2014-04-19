/*
* 当模块的文件名是index.js，
* 加载模块时可以使用模块所在目录的路径代替模块文件路径
*/
/*
/ 基本主页
/login 登陆界面
/logout 退出
/reg 注册界面
/user 全部用户信息页面
/[FORUMNAME] 每个论坛板块的页面
*/
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Thread = require('../models/thread.js');

var route = require('./route');

module.exports = function(app) {
	app.get('/', route.root.get);

	app.get('/login', route.login.get);

	app.post('/login', checkNotLogin);
	app.post('/login', route.login.post);

	app.get('/logout', checkLogin);
	app.get('/logout', route.logout.get);

	app.get('/reg', checkNotLogin);
	app.get('/reg', route.reg.get);

	app.post('/reg', checkNotLogin);
	app.post('/reg', route.reg.post);//END app.post(reg)

	app.get('/setting', checkLogin);
	app.get('/setting', route.setting.get)

	app.post('/setting', checkLogin);
	app.post('/setting', route.setting.post);

	app.get('/admin', checkLogin);
	app.get('/admin', route.admin.get);

	app.post('/admin', checkLogin);
	app.post('/admin', route.admin.post);

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
};//END catch app

function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '未登录!'); 
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登录!'); 
		res.redirect('back');
	}
	next();
}