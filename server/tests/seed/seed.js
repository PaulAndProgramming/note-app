const app = require('./../../server');
const Note = require('./../../models/note');
const User = require('./../../models/user');

const TEST_PASSWORD = "test123";

function create_users_in_db() {
  const USERS_INFO = [{
    email: "test_user_1@example.com",
    password: TEST_PASSWORD
  },{
    email: "test_user_2@example.com",
    password: TEST_PASSWORD
  }];

  return Promise.resolve(
    User.remove({}).then(() => {
      let users_to_save = [
        new User(USERS_INFO[0]).save(),
        new User(USERS_INFO[1]).save()
      ];

      return Promise.all(users_to_save);
    }).then(saved_users => {
      users_in_db = saved_users
      let user_tokens = saved_users.map(user => user.generateAuthToken());

      return Promise.all(user_tokens);
    }).then(() => {
      return users_in_db;
    })
  );
}

function create_notes_in_db(users_in_db) {
  const NOTES_INFO = [{
    text: "Test note 1",
    added: Date.now(),
    _creator: users_in_db[0]._id
  },{
    text: "Test note 2",
    added: Date.now(),
    _creator: users_in_db[0]._id
  },{
    text: "Test note 3",
    added: Date.now(),
    _creator: users_in_db[1]._id
  },{
    text: "Test note 4",
    added: Date.now(),
    _creator: users_in_db[1]._id
  }];

  return Promise.resolve(
    Note.remove({}).then(() => {
      return Note.insertMany(NOTES_INFO);
    }).then((notes_in_db) => {
      return notes_in_db;
    })
  );
}

function create_notes_and_users_in_db() {
  let users_to_return = [];
  let notes_to_return = [];

  return Promise.resolve(
    create_users_in_db().then(users_in_db => {
      users_to_return = users_in_db;
      return create_notes_in_db(users_in_db);
    }).then(notes_in_db => {
      notes_to_return = notes_in_db;
      return {users_in_db: users_to_return, notes_in_db: notes_to_return};
    })
  );
}

module.exports = { TEST_PASSWORD, create_notes_and_users_in_db };
