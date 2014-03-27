var mongodb = require('./db'); //Bind DB isEmptyObject()

//Obejct
function User(user) {
	this.userId = user.userId;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback) {
	//define an object
	var user = {
		userId: this.userId,
		password: this.password,
		email: this.email
	};
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(user, {safe: true}, function(err, user){
				mongodb.close();
				callback(null);
			})
		})
	})
}

User.get = function(userId, callback) {
	//find userId in DB users
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				userId : userId
			}, function(err, user){
				mongodb.close();
				if (user) {
					return callback(null, user);
				}
				callback(err);
			});
		});
	});
};