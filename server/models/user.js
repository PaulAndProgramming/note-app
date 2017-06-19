const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 5,
		trim: true,
		unique: true,
		validate: {
			isAsync: true,
			validator: validator.isEmail,
			message: "{VALUE} is not a valid e-mail"
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});
//override default toJSON method to return only _id and email
UserSchema.methods.toJSON = function(){
	const user = this;
	const user_object = user.toObject();
	return _.pick(user_object, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function(){
	let user = this;
	const access = 'auth';
	const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

	user.tokens.push({access, token});
	//keep no more than 100 tokens for one user
	user.tokens = user.tokens.slice(-100);

	return user.save().then(() => token);
};
UserSchema.methods.removeToken = function(token){
	const user = this;

	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};
UserSchema.statics.findByToken = function(token){
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch(err) {
		return Promise.reject();
	}

	return User.findOne({
		"_id": decoded._id,
		"tokens.token": token,
		"tokens.access": "auth"
	});
};
//find user by email and password
UserSchema.statics.findByCredentials = function(email, password){
	const User = this;
	return User.findOne({email}).then((user) => {
		if (!user) return Promise.reject();

		return new Promise((resolve, reject) => {
			//check if password provided is correct
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	})
};
//hash password before saving it to database
UserSchema.pre('save', function(next) {
	const user = this;

	//hash the password only if it is being changed or saved for the first time
	//do not re-hash the hash
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

let User = mongoose.model('User', UserSchema);

module.exports = User;
