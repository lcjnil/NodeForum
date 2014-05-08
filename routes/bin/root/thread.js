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

module.exports = {
	get: get
}