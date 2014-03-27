var mongodb = require('./db'),
	markdown = require('markdown').markdown;

function Thread(threadTitle, threadContent, threadOwner) {
	this.threadTitle = threadTitle;
	this.threadContent = threadContent;
	this.threadOwner = threadOwner;
}

module.exports = Thread;

Thread.prototype.save = function(callback) {
	console.log(this.threadOwner);
	var date = new Date();
	var time = {
		date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth()+1),
		day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
	}
	var thread = {
		time: time,
		threadTitle: this.threadTitle,
		threadContent: this.threadContent,
		threadOwner: this.threadOwner
	};

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('threads', function(err, collection) {
			if (err){
				return callback(err);
			}
			collection.insert(thread, {
				safe: true
			}, function(err, thread) {
				mongodb.close();
				callback(null);
			});
		});
	});
}

Thread.get = function(name, callback) {
	mongodb.open(function(err, db){
		if (err) {
			return callback(err);
		}
		db.collection('threads', function(err, collection) {
			if (err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			//Base on query search
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
				mongodb.close();
				if (err) {
          			callback(err);//失败！返回 err
      			}
      			docs.forEach(function (doc) {
					doc.threadContent = markdown.toHTML(doc.threadContent);
				});
		        callback(null, docs);//成功！以数组形式返回查询的结果
		    });
		});
	})
}