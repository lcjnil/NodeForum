var login = require('./bin/login.js'),
	root = require('./bin/root.js'),
	logout = require('./bin/logout.js'),
	reg = require('./bin/reg.js'),
	post = require('./bin/post.js');

module.exports = {
	root: root,
	login: login,
	logout: logout,
	reg: reg,
	post: post
};