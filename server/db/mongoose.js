let mongoose = require('mongoose');

//use default ES6 promise
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose;
