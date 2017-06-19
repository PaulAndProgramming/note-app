let User = require('./../models/user');

//authenticate user, do not allow unauthorized access
let authenticate = (req, res, next) => {
	const token = req.header('x-auth');

	User.findByToken(token).then(user => {
		if (!user) return Promise.reject();

		//make user and token variables available for use
		req.user = user;
		req.token = token;
		next();
	}).catch(err => {
		//send unauthorized if user token was not found
		res.status(401).send();
	});
};

module.exports = authenticate;
