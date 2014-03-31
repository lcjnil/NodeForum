var login = require('./bin/root/login.js'),
	root = require('./bin/root/root.js'),
	logout = require('./bin/root/logout.js'),
	reg = require('./bin/root/reg.js'),
	setting = require('./bin/root/setting.js');

module.exports = {
	root: root,
	login: login,
	logout: logout,
	reg: reg,
	setting: setting
};