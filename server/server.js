require('./config/config');

const path = require('path');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

let mongoose = require('./db/mongoose');
let Note = require('./models/note');
let User = require('./models/user');
let authenticate = require('./middleware/authenticate');

let app = express();
const SERVER_PORT = process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.json());
//handle errors to not send the full error stack to the client
app.use((err, req, res, next) => {
  res.status(400).send();
});

//create a new note
app.post('/notes', authenticate, (req, res) => {
  if (req.body.text == "") return res.status(400).send();
	let note = new Note({
		text: req.body.text,
		added: Date.now(),
		_creator: req.user._id
	});

	note.save().then(doc => {
		res.status(200).send(doc);
	}, err => {
		res.status(400).send();
	});
});

//get all user notes
app.get('/notes', authenticate, (req, res) => {
	Note.find({
		_creator: req.user._id
	}).then(notes => {
		res.status(200).send({notes});
	}).catch(err => {
		res.status(400).send()
	});
});

//delete several notes
app.delete('/notes', authenticate, (req, res) => {
	const noteIds = req.body.noteIds;
	//check if request body is a proper array
	if (!noteIds || !(noteIds instanceof Array) || noteIds.length == 0) return res.status(404).send();
	//check if every id in array is a valid ObjectID
	for (const noteId of noteIds) {
		if (!ObjectID.isValid(noteId)) return res.status(404).send();
	}

	Note.find({
		_id: {
			$in: noteIds
		},
		_creator: req.user._id
	}).then(notes => {
		//check if all provided id's were found, otherwise send 404
		if (!notes || notes.length != noteIds.length) return res.status(404).send();
		return Note.remove({
			_id: {
				$in: noteIds
			},
			_creator: req.user._id
		});
	}).then((result) => {
		if (!result) return res.status(404).send();

		res.send({result});
	}).catch(err => {
		res.status(400).send();
	});
});

//get selected note
app.get('/notes/:id', authenticate, (req, res) => {
	const ID = req.params.id;

	if (!ObjectID.isValid(ID)) return res.status(404).send();

	Note.findOne({
		_id: ID,
		_creator: req.user._id
	}).then(note => {
		if (!note) return res.status(404).send();

		res.send({note});
	}).catch(err => {
		res.status(400).send();
	});
});

//delete selected note
app.delete('/notes/:id', authenticate, (req, res) => {
	const ID = req.params.id;

	if (!ObjectID.isValid(ID)) return res.status(404).send();

	Note.findOneAndRemove({
		_id: ID,
		_creator: req.user._id
	}).then(note => {
		if (!note) return res.status(404).send();

		res.send({note});
	}).catch(err => {
		res.status(400).send();
	});
});

//update selected note
app.patch('/notes/:id', authenticate, (req, res) => {
	const id = req.params.id;
	const updated_note = _.pick(req.body, ['text']);

	if (!ObjectID.isValid(id)) return res.status(404).send();

	Note.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	},{
		$set: updated_note
	}, {
		new: true
	}).then(note => {
		if (!note) return res.status(404).send();

		res.send({note});
	}).catch(err => {
		res.status(400).send();
	});
});

//make a new user, return x-auth header for later use
app.post('/users', (req, res) => {
	const user_info = _.pick(req.body, ['email', 'password']);
	let user = new User(user_info);

	user.save().then(user => {
		return user.generateAuthToken();
	}).then(token => {
		res.header('x-auth', token).send(user);
	}).catch(err => {
		res.status(400).send();
	});
});

//return user info
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

//login user, return x-auth header for later use
app.post('/users/login', (req, res) => {
	const user_info = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(user_info.email, user_info.password).then((user) => {
		user.generateAuthToken().then(token => {
			res.header('x-auth', token).send(user);
		});
	}).catch(err => {
		res.status(400).send();
	});
});

//delete user token
app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch(err => {
		res.status(400).send();
	});
});

//serve index.html on all get routes
app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + './../public/index.html'));
});

app.listen(SERVER_PORT, () => {
	console.log(`server is listening on port ${SERVER_PORT}`);
});

module.exports = app;
