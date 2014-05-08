var login = require('./bin/root/login.js');
var root = require('./bin/root/root.js');
var logout = require('./bin/root/logout.js');
var reg = require('./bin/root/reg.js');
var setting = require('./bin/root/setting.js');
var forumMgr= require('./bin/admin/forum.js');
var admin = require('./bin/admin/root.js');
var postThread = require('./bin/root/postThread.js');
var forum = require('./bin/root/forum.js');
var thread = require('./bin/root/thread.js');

module.exports = {
	root: root,
	login: login,
	logout: logout,
	reg: reg,
	setting: setting,
	forumMgr: forumMgr,
	admin: admin,
	postThread: postThread,
	forum: forum,
	thread: thread
};