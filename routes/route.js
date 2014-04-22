var login = require('./bin/root/login.js');
var root = require('./bin/root/root.js');
var logout = require('./bin/root/logout.js');
var reg = require('./bin/root/reg.js');
var setting = require('./bin/root/setting.js');
var forum = require('./bin/admin/forum.js');
var admin = require('./bin/admin/root.js');

module.exports = {
	root: root,
	login: login,
	logout: logout,
	reg: reg,
	setting: setting,
	forum: forum,
	admin: admin
};