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
User = require('../models/user.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title : 'Index',
			chosen : 'index',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	});

	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res){
		res.render('login', {
			title: "Login",
			chosen: 'login',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		var md5 = crypto.createHash('md5'), 
			password = md5.update(req.body.password).digest('hex');
		//Get Password
		User.get(req.body.id, function(err, user) {
			if (!user) {
				req.flash('error', '用户不存在!'); 
  				return res.redirect('/login');
			}
			if (user.password != password) {
				req.flash('error', '密码错误!'); 
  				return res.redirect('/login');
			}
			req.session.user = user;
		    req.flash('success', '登陆成功!');
		    res.redirect('/');
		})	
	});

	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/');
	});

	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: 'Register',
			chosen: 'reg',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.get('reg', checkNotLogin);
	app.post('/reg', function(req, res) {
		var password = req.body.password,
			repeatpassword = req.body.repeatpassword;
		if (repeatpassword != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			id: req.body.userid,
			password: password,
			email: req.body.email
		});

		User.get(newUser.id, function(err, user) {
			if (user) {
				req.flash('error', '用户已存在!');
				console.log('Existed!')
				return res.redirect('/reg');
			}
			//else
			newUser.save(function(err) {
				if (err) {
					req.flash('error', err);
    				return res.redirect('/reg');
				}
				req.session.user = newUser;//用户信息存入 session
			    req.flash('success', '注册成功!');
			    res.redirect('/');//注册成功后返回主页
			});
		});
	});//END app.post(reg)	
};

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