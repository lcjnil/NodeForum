var mongodb = require('./db'); //Bind DB isEmptyObject()

//Obejct
function User(user) {
	this.id = user.id;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback) {
	//define an object
	var user = {
		id: this.id,
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

User.get = function(id, callback) {
	//find id in DB users
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
				id : id
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