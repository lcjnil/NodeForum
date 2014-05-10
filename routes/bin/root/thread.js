var Thread = require('../../../models/thread.js').Thread;
var Response = require('../../../models/response.js').Response;
var markdown = require('markdown').markdown;
var EventProxy = require('eventproxy');

function get(req, res) {
	var ep = new EventProxy();
	Thread.findOne({threadId: req.params.threadId}, function(err, oneThread){
		if (err||!oneThread) {
			req.flash('err', 'NO SUCH THREAD');
			return res.redirect('back');
		}
		oneThread.populate(['author', 'responseId'], function(err, oneThread){
			if (err) {
				req.flash('err', 'POPULATE FAILED!');
				return res.redirect('back');
			}
			console.log(oneThread);
			oneThread.content = markdown.toHTML(oneThread.content);
			oneThread.responseId.forEach(function(response){
				response.content = markdown.toHTML(response.content);
				response.populate('author', function(err, oneResponse){
					ep.emit('populateRes', oneResponse);
				})
			});
			ep.after('populateRes', oneThread.responseId.length,function(response){
				res.render('./thread', {
					title: '修改' + oneThread.title,
					success: req.flash('success').toString(),
					error: req.flash('error').toString(),
					user: req.session.user,
					thread: oneThread,
					response: response
				})
			});
		});
	});
};

function post(req, res) {
	if (req.body.edit){
		handleEdit(req, res);
	}
	else if (req.body.editText) {
		handleEditText(req, res);
	}
	else if (req.body.response) {
		handleResponse(req, res);
	}
}

function handleEdit(req, res) {
	Thread.findOne({threadId: req.params.threadId}, function(err, oneThread) {
		if (err||!oneThread) {
			req.flash('err', 'NO SUCH THREAD');
			return res.redirect('back');
		}
		res.render('./threadEdit', {
			title: '修改' + oneThread.title,
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user,
			thread: oneThread
		});
	})
}

function handleEditText(req, res) {
	Thread.findOne({threadId: req.params.threadId}, function(err, oneThread) {
		if (err||!oneThread) {
			req.flash('err', 'NO SUCH THREAD');
			return res.redirect('back');
		}
		oneThread.title = req.body.title;
		oneThread.content = req.body.content;
		oneThread.save(function(err){
			if (err){
				console.log('SAVE ERR');
				req.flash('err', 'ERROR');
				return res.redirect('back');
			}
			req.flash('success', 'success');
			res.redirect('/thread/'+req.params.threadId);
		});
	});
}

function handleResponse(req, res) {
	var ep = new EventProxy();
	Response.count({}, function(err, count) {
		if (err) {
			console.log('COUNT ERR!!!!!');
			req.flash('err', 'TAT ERROR!!!');
			return res.redirect('back');
		}
		ep.emit('countRes', count);
	})

	ep.all('countRes', function(count) {
		var response = new Response({
			reponseId: count + 1,
			author: req.session.user._id,
			threadId: req.params.threadId,
			content: req.body.resContent
		});
		response.save(function(err) {
			if (err) {
				console.log('COUNT ERR!!!!!');
				req.flash('err', 'TAT ERROR!!!');
				return res.redirect('back');
			}
			Thread.findOne({threadId: req.params.threadId}, function(err, oneThread){
				oneThread.responseId.push(response);
				oneThread.save(function(err){
					if (err) {
						console.log('COUNT ERR!!!!!');
						req.flash('err', 'TAT ERROR!!!');
						return res.redirect('back');
					}
					req.flash('success', 'RESPONSE SUCCESS');
					res.redirect('back');
				});
			})
		})
	})
}
module.exports = {
	get: get,
	post: post
}