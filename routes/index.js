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

module.exports = function(app) {
	app.get('/', function(req, res) {
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
	});

	app.get('/login', function(req, res){
		res.redirect('back');
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		if (req.body.userid.length==0 || req.body.password==0) {
			return res.redirect('/');
		}
		var md5 = crypto.createHash('md5'), 
			password = md5.update(req.body.password).digest('hex');
		//Get Password
		User.get(req.body.userid, function(err, user) {
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
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user
		});
	});

	app.post('/reg', checkNotLogin);
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

	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
		var currentUser = req.session.user;
		console.log(currentUser);
		var thread = new Thread(req.body.title, req.body.content, currentUser.id);
		thread.save(function(err){
			if (err) {
				req.flash('error', err);
				return res.redirect('/post');
			}
			req.flash('success', '发布成功!');
    		res.redirect('/');
		});
	});
	
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