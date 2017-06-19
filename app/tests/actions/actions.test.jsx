import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from 'actions/actions.jsx';
import { getUserInfo, getNotes, deleteAllNotes } from 'tests/seed/seed.jsx';

const createMockStore = configureMockStore([thunk]);

describe('actions', () => {

let userInfo;
let userNotes;

beforeEach(done => {
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

describe('setSearchText', () => {
  it('should generate a search action', () => {
    const searchText = "test text";
    const action = {
      type: "SET_SEARCH_TEXT",
      text: searchText
    };
    const result = actions.setSearchText(searchText);

    expect(result).toEqual(action);
  });
});


describe('addNewNote', () => {
  it('should generate add new note action', () => {
    const note = {
      text: "test text 1",
      date_added: 123,
      id: "123abc"
    };
    const action = {
      type: "ADD_NEW_NOTE",
      note: note
    };
    const result = actions.addNewNote(note);

    expect(result).toEqual(action);
  });
});

describe('startAddingNewNote', () => {
  it('should dispatch addNewNote action', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    const noteText = "text text 123";
    store.dispatch(actions.startAddingNewNote(noteText)).then((res) => {
      const storeActions = store.getActions();
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0].type).toEqual('ADD_NEW_NOTE');
      expect(storeActions[0].note.text).toEqual(noteText);
      done();
    }).catch(done);
  });

  it('should dispatch checkIfLoggedIn action if authToken is incorrect', (done) => {
    const store = createMockStore({
      authToken: "wrongToken"
    });
    const noteText = "text text 123";
    store.dispatch(actions.startAddingNewNote(noteText)).then((res) => {
      const storeActions = store.getActions();
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0].type).toEqual('ADD_NEW_NOTE');
      expect(storeActions[0].note.text).toEqual(noteText);
      done();
    }).catch(done);
    done();
  });

  it('should dispatch checkIfLoggedIn action if noteText is empty', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    const noteText = "";
    store.dispatch(actions.startAddingNewNote(noteText)).then((res) => {
      const storeActions = store.getActions();
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0].type).toEqual('LOGIN_USER');
      expect(storeActions[0].authToken).toExist();
      done();
    }).catch(done);
  });
});

describe('addAllNotes', () => {
  it('should generate add all notes action', () => {
    const notes = [{
      text: "test text 1",
      date_added: 123,
      id: "123a"
    }, {
      text: "test text 2",
      date_added: 124,
      id: "123b"
    }];
    const action = {
      type: "ADD_ALL_NOTES",
      notes: notes
    };
    const result = actions.addAllNotes(notes);

    expect(result).toEqual(action);
  });
});

describe('startFetchingNotes', () => {
  it('should dispatch addAllNotes action', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    store.dispatch(actions.startFetchingNotes()).then((res) => {
      const storeActions = store.getActions();
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0].type).toEqual('ADD_ALL_NOTES');
      expect(storeActions[0].notes.length).toEqual(3);
      done();
    }).catch(done);
  });

  it('should not dispatch addAllNotes action if authToken is incorrect', (done) => {
    const store = createMockStore({
      authToken: "wrongToken"
    });
    const noteIds = [userNotes[0]._id];
    store.dispatch(actions.startDeletingNotes(noteIds)).then((res) => {
      expect(store.getActions.length).toEqual(0);
      done();
    }).catch(done);
  });
});

describe('deleteSelectedNotes', () => {
  it('should generate delete selected notes action', () => {
    const noteIds = ["123a", "123b"];
    const action = {
      type: "DELETE_SELECTED_NOTES",
      noteIds: noteIds
    };
    const result = actions.deleteSelectedNotes(noteIds);

    expect(result).toEqual(action);
  });
});

describe('startDeletingNotes', () => {
  it('should dispatch deleteSelectedNotes action', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    const noteIds = [userNotes[0]._id];
    store.dispatch(actions.startDeletingNotes(noteIds)).then((res) => {
      const storeActions = store.getActions();
      const expectedAction = actions.deleteSelectedNotes(noteIds);
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0]).toEqual(expectedAction);
      done();
    }).catch(done);
  });

  it('should not dispatch deleteSelectedNotes action if authToken is incorrect', (done) => {
    const store = createMockStore({
      authToken: "wrongToken"
    });
    const noteIds = [userNotes[1]._id];
    store.dispatch(actions.startDeletingNotes(noteIds)).then((res) => {
      const storeActions = store.getActions();
      const unexpectedAction = actions.deleteSelectedNotes(noteIds);
      expect(storeActions).toNotInclude(unexpectedAction);
      done();
    }).catch(done);
  });

  it('should not dispatch deleteSelectedNotes action if variable passed to function is not an array', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    const noteIds = "";
    store.dispatch(actions.startDeletingNotes(noteIds)).then((res) => {
      const storeActions = store.getActions();
      const unexpectedAction = actions.deleteSelectedNotes(noteIds);
      expect(storeActions).toNotInclude(unexpectedAction);
      done();
    }).catch(done);
  });
});

describe('toggleNoteSelected', () => {
  it('should generate toggle note seleced action', () => {
    const noteId = "123abc";
    const action = {
      type: "TOGGLE_NOTE_SELECTED",
      noteId: noteId
    };
    const result = actions.toggleNoteSelected(noteId);

    expect(result).toEqual(action);
  });
});

describe('selectAllNotes', () => {
  it('should generate select all notes action', () => {
    const action = {
      type: "SELECT_ALL_NOTES"
    };
    const result = actions.selectAllNotes();

    expect(result).toEqual(action);
  });
});

describe('deselectAllNotes', () => {
  it('should generate deselect all notes action', () => {
    const action = {
      type: "DESELECT_ALL_NOTES"
    };
    const result = actions.deselectAllNotes();

    expect(result).toEqual(action);
  });
});

describe('loginUser', () => {
  it('should generate login user action', () => {
    const authToken = "123abc";
    const action = {
      type: "LOGIN_USER",
      authToken: authToken
    };
    const result = actions.loginUser(authToken);

    expect(result).toEqual(action);
  });
});

describe('logoutUser', () => {
  it('should generate logout user action', () => {
    const action = {
      type: "LOGOUT_USER"
    };
    const result = actions.logoutUser();

    expect(result).toEqual(action);
  });
});

describe('startUserLogin', () => {

  it('should dispatch loginUser action when credentials are correct', (done) => {
    const store = createMockStore({});

    store.dispatch(actions.startUserLogin(userInfo.email, userInfo.password)).then((res) => {
      const authToken = res.headers['x-auth'];
      const storeActions = store.getActions();
      const expectedAction = actions.loginUser(authToken);
      expect(storeActions.length).toEqual(1);
      expect(storeActions[0]).toEqual(expectedAction);
      done();
    }).catch(done);
  });

  it('should throw an error when credentials are incorrect', (done) => {
    const store = createMockStore({});
    store.dispatch(actions.startUserLogin("wrongemail", "short")).then(() => {
      done(Error('Should not run this line'));
    }).catch(() => {
      expect(store.getActions().length).toEqual(0);
      done();
    });
  });
});

describe('checkIfLoggedIn', () => {

  it('should dispatch logoutUser action if token in storage is wrong', (done) => {
    const store = createMockStore({
      authToken: "wrongToken"
    });
    store.dispatch(actions.checkIfLoggedIn()).then((res) => {
      const storeActions = store.getActions();
      const action = actions.logoutUser();
      expect(storeActions).toInclude(action);
      done();
    }).catch(done);
  });

  it('should dispatch loginUser action if token in storage is correct', (done) => {
    const store = createMockStore({
      authToken: userInfo.authToken
    });
    store.dispatch(actions.checkIfLoggedIn()).then((res) => {
      const storeActions = store.getActions();
      const action = actions.loginUser(userInfo.authToken);
      expect(storeActions).toInclude(action);
      done();
    }).catch(done);
  });

  it('should dispatch logoutUser action if token in storage and localStorage is not set', (done) => {
    const store = createMockStore({
      authToken: ""
    });
    localStorage.removeItem('x-auth');
    store.dispatch(actions.checkIfLoggedIn()).then((res) => {
      const storeActions = store.getActions();
      const action = actions.logoutUser();
      expect(storeActions).toInclude(action);
      done();
    }).catch(done);
  });

  it('should dispatch logoutUser action if token in storage is not set and token in localStorage is incorrect', (done) => {
    const store = createMockStore({
      authToken: ""
    });
    localStorage.setItem('x-auth', "wrongToken");
    store.dispatch(actions.checkIfLoggedIn()).then((res) => {
      const storeActions = store.getActions();
      const action = actions.logoutUser();
      expect(storeActions).toInclude(action);
      done();
    }).catch(done);
  });

  it('should dispatch loginUser action if token in storage is not set and token in localStorage correct', (done) => {
    const store = createMockStore({
      authToken: ""
    });
    localStorage.setItem('x-auth', userInfo.authToken);
    store.dispatch(actions.checkIfLoggedIn()).then((res) => {
      const storeActions = store.getActions();
      const action = actions.loginUser(userInfo.authToken);
      expect(storeActions).toInclude(action);
      done();
    }).catch(done);
  });
});

});
