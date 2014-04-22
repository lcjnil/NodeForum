/*
* This routes routes for managing the forum and forum groups
*/
var forumName = require('../../../models/forumName.js').forumName;
var forumGroup = require('../../../models/forumName.js').forumGroup;

var EventProxy = require('eventproxy');

function get(req, res) {
	forumGroup.find({}, function(err, forumGroups) {
		var ep = new EventProxy();
		var outForum = [], flag = 0;
		if (err) {
			ep.emitLater('done');
		}
		else if (forumGroups.length==0) {
			console.log("done empty");
			ep.emitLater('done');
		}
		else {
			forumGroups.forEach(function(forumGroup, index) {
				forumGroup.populate('forumNames', {} , function(err, newForumGroups) {	
					outForum.push(newForumGroups);
					ep.emitLater('finishPop');
				});
			});
			ep.after('finishPop', forumGroups.length, function(){
				ep.emitLater('done');
			});
		}

		ep.all('done', function() {
			res.render('./admin/forum', {
				title : 'Admin--Forum Manager',
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
				forumGroups: outForum
			});
		});
	});
};

function post(req, res) {
	console.log(req.body);
	if (req.body.deleteGroupId) {
		deleteGroupId(req, res);
	}
	//Add new forum group
	else if (req.body.addGroupId) {
		addGroupId(req, res);
	}
	//add new forum
	else if (req.body.addForumId) {
		addNewForum(req, res);
	}
	else if (req.body.deleteForumId) {
		deleteForumId(req, res);
	}
};

function deleteGroupId(req, res) {
	var ep = new EventProxy();
	forumGroup.findOne({groupId: req.body.deleteGroupId - '0'}, function(err, oneForumGroup) {
		oneForumGroup.forumNames.forEach(function(oneForumName){
			forumName.remove({_id: oneForumName}, function(err){
				ep.emitLater('finishDeleteForum');
			})
		});
		
		//delete all the forum
		ep.after('finishDeleteForum', oneForumGroup.forumNames.length, function(){
			forumGroup.remove({groupId : req.body.deleteGroupId - '0'}, function(err){
				if (err) {
					req.flash('error','Oops, There must be something wrong');
					return res.redirect('back');
				}
				req.flash('success','Success');
				res.redirect('back');
			});
		});
	});
	
}

function addGroupId(req, res) {
	var newForumGroup = new forumGroup({
		groupId: req.body.addGroupId,
		area: req.body.area
	});
	newForumGroup.save(function(err){
		if (err) {
			req.flash('error', err);
			return res.redirect('back');	
		}
		req.flash('success', 'Success Added!!');
		res.redirect('back');
	});
}

function addNewForum(req, res) {
	var ep = new EventProxy();
	var newForumName = new forumName({
		forumId: req.body.addForumId - '0',
		name: req.body.name,
		description: req.body.description
	});

	forumName.findOne({forumId: req.body.addForumId - '0'}, function(err, oneForumName) {
		if (err) {
			req.flash('error', 'error');
			return res.redirect('back');
		}
		else {
			if (oneForumName) {
				req.flash('error', 'error');
				return res.redirect('back');
			}
			ep.emitLater('forumIdChecked');
		}
	});
	ep.all('forumIdChecked', function() {
		forumGroup.findOne({groupId :req.body.groupId - '0'}, function(err, oneForumGroup) {
			if (!oneForumGroup) {
				req.flash('error', 'error');
				return res.redirect('back');
			}
			newForumName.parent = oneForumGroup._id;
			newForumName.save();
			oneForumGroup.forumNames.push(newForumName._id);
			oneForumGroup.save();
			req.flash('success', 'Success');
			res.redirect('back');
		});
	});
}

function deleteForumId(req, res) {
	var ep = new EventProxy();
	forumName.findOne({forumId: req.body.deleteForumId - '0'}, function(err, oneForumName) {
		forumGroup.findOne({_id: oneForumName.parent}, function(err, oneForumGroup){
			oneForumGroup.forumNames.splice(oneForumGroup.forumNames.indexOf(oneForumName._id), 1);
			oneForumGroup.save();
			ep.emitLater('finishDeleteForumInGroup');
		});
	});
	ep.all('finishDeleteForumInGroup', function(){
		forumName.remove({forumId: req.body.deleteForumId - '0'}, function(err) {
			if (err) {
				req.flash('error', 'error');
				return res.redirect('back');
			}
			req.flash('success', 'success');
			res.redirect('back');
		});
	});
}
module.exports = {
	get: get,
	post: post
}
