var Thread = require('../../../models/thread.js').Thread;
var markdown = require('markdown').markdown;

function get(req, res) {
	Thread.findOne({threadId: req.params.threadId}, function(err, oneThread){
		if (err||!oneThread) {
			req.flash('err', 'NO SUCH THREAD');
			return res.redirect('back');
		}
		oneThread.populate('author', function(err, oneThread){
			if (err) {
				req.flash('err', 'POPULATE FAILED!');
				return res.redirect('back');
			}
			oneThread.content = markdown.toHTML(oneThread.content);
			res.render('./thread', {
				title : oneThread.title,
				success: req.flash('success').toString(),
				error: req.flash('error').toString(),
				user: req.session.user,
				thread: oneThread
			});
		})
	});
};

function post(req, res) {
	if (req.body.edit){
		handleEdit(req, res);
	}
	else if (req.body.editText) {
		handleEditText(req, res);
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
	})
}
module.exports = {
	get: get,
	post: post
}