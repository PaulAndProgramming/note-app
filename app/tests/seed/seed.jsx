import * as RestAPI from 'api/RestAPI.jsx';

const USER_EMAIL = process.env.TEST_USER_EMAIL;
const USER_PASSWORD = process.env.TEST_USER_PASSWORD;

//gets all notes then deletes them
export const deleteAllNotes = (token) => {
  return RestAPI.get_notes(token).then((res) => {
    const noteIds = JSON.parse(res.body).notes.map(note => note._id);
    if (noteIds.length == 0) return Promise.resolve();
    return RestAPI.delete_notes(noteIds, token);
  });
};

//gets email, password and authToken of the user
export const getUserInfo = () => {
  return RestAPI.post_users_login(USER_EMAIL, USER_PASSWORD).then((res) => {
    const authToken = res.headers['x-auth'];

    return {
      email: USER_EMAIL,
      password: USER_PASSWORD,
      authToken: authToken
    };
  });
};

//returns three notes
export const getNotes = (token) => {
  const promiseNotes = [
    RestAPI.post_notes("Test text 1", token),
    RestAPI.post_notes("Test text 2", token),
    RestAPI.post_notes("Test text 3", token)
  ];

  return Promise.all(promiseNotes);
};
