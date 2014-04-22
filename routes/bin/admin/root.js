function get(req, res) {
	res.render('./admin/root',{
		title : 'Admin!!!!!',
		success: req.flash('success').toString(),
		error: req.flash('error').toString(),
		user: req.session.user
	})
}

module.exports = {
	get: get
}