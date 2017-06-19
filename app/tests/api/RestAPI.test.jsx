import expect from 'expect';

import * as RestAPI from 'api/RestAPI.jsx';
import { getUserInfo, getNotes, deleteAllNotes } from 'tests/seed/seed.jsx';

describe('RestAPI', () => {

let userInfo;
let userNotes;

before(done => {
  //get userInfo, delete all notes of the user, get 3 notes
  getUserInfo().then((res) => {
    userInfo = res;
    return deleteAllNotes(userInfo.authToken);
  }).then(() => {
    //returns 3 notes
    return getNotes(userInfo.authToken);
  }).then((res) => {
    userNotes = res.map(res => JSON.parse(res.body));
    done();
  }).catch(done);
});

describe('post_users_login', () => {
  it('should return response with x-auth header when redentials are correct', (done) => {
    RestAPI.post_users_login(userInfo.email, userInfo.password).then((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.headers['x-auth'].length).toBeGreaterThan(0);
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when credentials are wrong', (done) => {
    RestAPI.post_users_login("wrongemail", "wrongpassword").then((res) => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

describe('get_users_me', () => {
  it('should return response when token is correct', (done) => {
    RestAPI.get_users_me(userInfo.authToken).then((res) => {
      expect(res).toExist();
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when token is incorrect', (done) => {
    RestAPI.get_users_me("wrongToken").then((res) => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

describe('post_notes', () => {

  after(done => {
    deleteAllNotes(userInfo.authToken).then(() => {
      return getNotes(userInfo.authToken);
    }).then((res) => {
      userNotes = res.map(res => JSON.parse(res.body));
      done();
    }).catch(done);
  });

  const noteText = "Test note text";

  it('should return response when noteText and token are correct', (done) => {
    RestAPI.post_notes(noteText, userInfo.authToken).then((res) => {
      expect(res).toExist();
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when token is incorrect', (done) => {
    RestAPI.post_notes(noteText, "wrongToken").then((res) => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });

  it('should reject when noteText is empty', (done) => {
    RestAPI.post_notes("", userInfo.authToken).then((res) => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

describe('get_notes', () => {
  it('should return response when token is correct', (done) => {
    RestAPI.get_notes(userInfo.authToken).then((res) => {
      const notes = JSON.parse(res.body).notes;
      expect(notes).toExist();
      expect(notes.length).toEqual(3);
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when token is incorrect', (done) => {
    RestAPI.get_notes("wrongToken").then((res) => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

describe('delete_notes', () => {

  it('should return response when token and noteIds array are correct', (done) => {
    const noteIds = userNotes.map(note => note._id);
    RestAPI.delete_notes(noteIds, userInfo.authToken).then(() => {
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when token is incorrect', (done) => {
    const noteIds = userNotes.map(note => note._id);
    RestAPI.delete_notes(noteIds, "wrongToken123").then(() => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });

  it('should reject when one of the noteIds is invalid', (done) => {
    const noteIds = userNotes.map(note => note._id);
    noteIds[0] = "wrongId";
    RestAPI.delete_notes(noteIds, userInfo.authToken).then(() => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });

  it('should reject when noteIds array is empty', (done) => {
    const noteIds = [];
    RestAPI.delete_notes(noteIds, userInfo.authToken).then(() => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

describe('delete_users_me_token', () => {
  it('should return response when token is correct', (done) => {
    RestAPI.delete_users_me_token(userInfo.authToken).then((res) => {
      expect(res).toExist();
      done();
    }).catch(() => {
      done(Error('Should not run this line'));
    });
  });

  it('should reject when token is incorrect', (done) => {
    RestAPI.delete_users_me_token("wrongToken").then(() => {
      done(Error('Should not run this line'));
    }).catch(() => {
      done();
    });
  });
});

});
