var mongoose = require('./mongoose');

var responseSchema = new mongoose.Schema({
	responseId: Number,
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	submitDate: {type:Date, default:Date.now},
	threadId: Number,
	content: String
},{
	collection: 'response'
});

var Response = mongoose.model('response', responseSchema);

module.exports = {
	Response: Response
};