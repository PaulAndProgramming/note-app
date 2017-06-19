const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('./../server');
const Note = require('./../models/note');
const User = require('./../models/user');
const { TEST_PASSWORD, create_notes_and_users_in_db } = require('./seed/seed');

let users_in_db = [];
let notes_in_db = [];

//add two users and four notes in db before each "it" statement
beforeEach(done => {
	create_notes_and_users_in_db()
		.then(users_and_notes_in_db => {
			({users_in_db, notes_in_db} = users_and_notes_in_db);
			done();
		});
});

describe('POST /notes', () => {
	it('should create a new note', (done) => {
		const text = "New test text";

		request(app)
			.post('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toEqual(text);
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.find().then((notes) => {
					expect(notes.length).toEqual(notes_in_db.length+1);
					expect(notes[notes_in_db.length].text).toEqual(text);
					done();
				}).catch(err => done(err));
			});
	});

	it ('should not create a note with invalid body data', (done) => {
		const text = "New test text";

		request(app)
			.post('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.find().then((notes) => {
					expect(notes.length).toEqual(notes_in_db.length);
					done();
				}).catch(err => done(err));
			});
	});
});

describe('GET /notes', () => {
	it('should get all notes', (done) => {
		request(app)
			.get('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.notes.length).toBe(2);
			})
			.end(done);
	});
});

describe('DELETE /notes', () => {
	it('should remove two notes', (done) => {
		request(app)
			.delete('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({noteIds:[notes_in_db[0]._id.toHexString(), notes_in_db[1]._id.toHexString()]})
			.expect(200)
			.expect((res) => {
				expect(res.body.result.ok).toEqual(1);
				expect(res.body.result.n).toEqual(2);
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note).toNotExist();
					return Note.findById(notes_in_db[1]._id.toHexString());
				}).then((note) => {
					expect(note).toNotExist();
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 404 if any of the notes are not the owners', (done) => {
		request(app)
			.delete('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({noteIds:[notes_in_db[0]._id.toHexString(), notes_in_db[2]._id.toHexString()]})
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note).toExist();
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 404 if any of the notes were not found', (done) => {
		const objectID_string = new ObjectID().toHexString();

		request(app)
			.delete('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({noteIds:[notes_in_db[0]._id.toHexString(), objectID_string]})
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note).toExist();
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 404 if any of the ids are invalid', (done) => {
		request(app)
			.delete('/notes')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({noteIds:[notes_in_db[0]._id.toHexString(), "123"]})
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note).toExist();
					done();
				}).catch(err => done(err));
			});
	});
});

describe('GET /notes/:id', () => {
	it('should get the note when id is correct and note exists', (done) => {
		request(app)
			.get(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send()
			.expect(200)
			.expect((res) => {
				expect(res.body.note.text).toEqual(notes_in_db[0].text);
			})
			.end(done);
	});

	it('should not return a note created by other user', (done) => {
		request(app)
			.get(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[1].tokens[0].token)
			.send()
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});

	it('should not get the note when id is incorrect', (done) => {
		request(app)
			.get(`/notes/123}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send()
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});

	it('should not get the note when the note does not exist', (done) => {
		const objectID_string = new ObjectID().toHexString();

		request(app)
			.get(`/notes/${objectID_string}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send()
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('DELETE /notes/:id', () => {
	it('should remove a note', (done) => {
		request(app)
			.delete(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.note.text).toEqual(notes_in_db[0].text);
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note).toNotExist();
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 404 if a note was not found', (done) => {
		const objectID_string = new ObjectID().toHexString();

		request(app)
			.delete(`/notes/${objectID_string}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.find().then((notes) => {
					expect(notes.length).toEqual(notes_in_db.length);
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 404 if id is invalid', (done) => {
		request(app)
			.delete(`/notes/123`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.find().then((notes) => {
					expect(notes.length).toEqual(notes_in_db.length);
					done();
				}).catch(err => done(err));
			});
	});
});

describe('PATCH /notes/:id', () => {
	it('should update all possible values', (done) => {
		const updated_note = {
			text: "updated text"
		};
		request(app)
			.patch(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send(updated_note)
			.expect(200)
			.expect((res) => {
				expect(res.body.note.text).toEqual(updated_note.text);
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toEqual(updated_note.text);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not update non-existing values', (done) => {
		const updated_note = {
			text: "updated text",
			added: "updated added value",
			non_existing_value: "non existing value"
		};
		request(app)
			.patch(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send(updated_note)
			.expect(200)
			.expect((res) => {
				expect(res.body.note.text).toEqual(updated_note.text);
				expect(res.body.note.non_existing_value).toNotExist();
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toEqual(updated_note.text);
					expect(note.non_existing_value).toNotExist();
					done();
				}).catch(err => done(err));
			});
	});

	it('should not update "added" value', (done) => {
		const updated_note = {
			text: "updated text",
			added: "updated added value"
		};
		request(app)
			.patch(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send(updated_note)
			.expect(200)
			.expect((res) => {
				expect(res.body.note.text).toEqual(updated_note.text);
				expect(res.body.note.added).toNotEqual(updated_note.added);
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toEqual(updated_note.text);
					expect(note.added).toNotEqual(updated_note.added);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not update the note created by other user', (done) => {
		const updated_note = {
			text: "updated text",
			added: "updated added value"
		};

		request(app)
			.patch(`/notes/${notes_in_db[0]._id.toHexString()}`)
			.set('x-auth', users_in_db[1].tokens[0].token)
			.send(updated_note)
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toNotEqual(updated_note.text);
					expect(note.added).toNotEqual(updated_note.added);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not update when ID is invalid', (done) => {
		const updated_note = {
			text: "updated text",
			added: "updated added value"
		};

		request(app)
			.patch(`/notes/123`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send(updated_note)
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toNotEqual(updated_note.text);
					expect(note.added).toNotEqual(updated_note.added);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not update when ID is not found', (done) => {
		const non_existing_id = new ObjectID().toHexString();
		const updated_note = {
			text: "updated text",
			added: "updated added value"
		};

		request(app)
			.patch(`/notes/${non_existing_id}`)
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send(updated_note)
			.expect(404)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end((err, res) => {
				if (err) return done(err);

				Note.findById(notes_in_db[0]._id.toHexString()).then((note) => {
					expect(note.text).toNotEqual(updated_note.text);
					expect(note.added).toNotEqual(updated_note.added);
					done();
				}).catch(err => done(err));
			});
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.send({})
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toEqual(users_in_db[0]._id.toHexString());
				expect(res.body.email).toEqual(users_in_db[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.send({})
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		const USER_INFO = {
				email: "test1234@example.com",
				password: "test123"
		};
		request(app)
			.post('/users')
			.send(USER_INFO)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toEqual(USER_INFO.email);
			})
			.end(err => {
				if (err) return done(err);

				User.findOne({email: USER_INFO.email}).then(user => {
					expect(user).toExist();
					expect(user.password).toNotBe(USER_INFO.password);
					done();
				}).catch(err => done(err));
			});
	});

	it('should return 400 if request is invalid', (done) => {
		request(app)
			.post('/users')
			.send({
				email: "123"
			})
			.expect(400)
			.end(done);
	});

	it('should not create a user if an email is in use', (done) => {
		const EXISTING_USER = {
			email: users_in_db[0].email,
			password: "test123"
		};

		request(app)
			.post('/users')
			.send(EXISTING_USER)
			.expect(400)
			.end(done);
	});
});

describe('POST /users/login', () => {

	it('should login user and return auth token', (done) => {
		const USER_INFO = {
			email: users_in_db[0].email,
			password: TEST_PASSWORD
		};

		request(app)
			.post('/users/login')
			.send(USER_INFO)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toExist();
				expect(res.body.email).toEqual(USER_INFO.email);
				expect(res.headers['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) return done(err);

				User.findOne({email: USER_INFO.email}).then(user => {
					expect(user.tokens[1]).toInclude({
						access: "auth",
						token: res.headers['x-auth']
					});
					done();
				}).catch(err => done(err));
			});
	});

	it('should reject invalid login', (done) => {
		const INVALID_USER_INFO = {
			email: users_in_db[0].email,
			password: "wrong_password"
		}
		request(app)
			.post('/users/login')
			.send(INVALID_USER_INFO)
			.expect(400)
			.expect(res => {
				expect(res.body).toEqual({});
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) return done(err);

				User.findOne({email: INVALID_USER_INFO.email}).then(user => {
					expect(user.tokens.length).toEqual(1);
					done();
				}).catch(err => done(err));
			});
	});
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users_in_db[0].tokens[0].token)
			.expect(200)
			.end(err => {
				if (err) return done(err);

				User.findOne({email: users_in_db[0].email}).then(user => {
					expect(user.tokens.length).toEqual(0);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not remove auth token when token is invalid', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', '')
			.expect(401)
			.end(err => {
				if (err) return done(err);

				User.findOne({email: users_in_db[0].email}).then(user => {
					expect(user.tokens.length).toEqual(1);
					done();
				}).catch(err => done(err));
			});
	});
});
