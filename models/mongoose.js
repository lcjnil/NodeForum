var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/forum');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connection to database established')
});


module.exports = mongoose;