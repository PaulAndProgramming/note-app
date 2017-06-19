import * as RestAPI from 'api/RestAPI.jsx';

//searchText actions
export const setSearchText = (text) => {
  return {
    type: 'SET_SEARCH_TEXT',
    text
  };
};

//notes actions
export const addNewNote = (note) => {
  return {
    type: "ADD_NEW_NOTE",
    note: note
  }
};

export const startAddingNewNote = (noteText) => {
  return (dispatch, getState) => {

    return RestAPI.post_notes(noteText, getState().authToken).then(res => {
      const returnedNote = JSON.parse(res.body);
      const newNote = {
          text: returnedNote.text,
          date_added: returnedNote.added,
          id: returnedNote._id
      };
      dispatch(addNewNote(newNote));
    }, err => {
      //if something went wrong check if user is really logged in
      return dispatch(checkIfLoggedIn());
    });
  };
};

export const addAllNotes = (notes) => {
  return {
    type: "ADD_ALL_NOTES",
    notes: notes
  };
};

export const startFetchingNotes = () => {
  return (dispatch, getState) => {
    return RestAPI.get_notes(getState().authToken).then(res => {
      const returnedNotes = JSON.parse(res.body).notes;
      let notes = returnedNotes.map(note => {
        return {
          text: note.text,
          date_added: note.added,
          id: note._id,
          selected: false
        };
      });
      dispatch(addAllNotes(notes));
    }, err => {
      //if something went wrong check if user is really logged in
      return dispatch(checkIfLoggedIn());
    });
  };
};

export const deleteSelectedNotes = (noteIds) => {
  return {
    type: "DELETE_SELECTED_NOTES",
    noteIds: noteIds
  };
};

export const startDeletingNotes = (noteIds) => {
  return (dispatch, getState) => {
    return RestAPI.delete_notes(noteIds, getState().authToken).then(res => {
      dispatch(deleteSelectedNotes(noteIds));
    }).catch(err => {
      //if something went wrong check if user is really logged in
      return dispatch(checkIfLoggedIn());
    });
  };
}

export const toggleNoteSelected = (noteId) => {
  return {
    type: "TOGGLE_NOTE_SELECTED",
    noteId: noteId
  };
};

export const selectAllNotes = () => {
  return {
    type: "SELECT_ALL_NOTES"
  };
};

export const deselectAllNotes = () => {
  return {
    type: "DESELECT_ALL_NOTES"
  };
};

export const loginUser = (authToken) => {
  localStorage.setItem('x-auth', authToken);
  return {
    type: "LOGIN_USER",
    authToken: authToken
  };
};

export const logoutUser = (authToken) => {
  localStorage.removeItem('x-auth');
  //response is not necessary
  if (authToken) RestAPI.delete_users_me_token(authToken);
  return {
    type: "LOGOUT_USER"
  };
};

export const startUserLogin = (email, password) => {
  return (dispatch, getState) => {
    return RestAPI.post_users_login(email, password).then(res => {
      if (!res || !res.headers || !res.headers['x-auth']) throw new Error("x-auth header was not returned");
      const authToken = res.headers['x-auth'];
      dispatch(loginUser(authToken));
      return res;
    }, err => {
      //should be catched in .then or .catch
      throw new Error();
    })
  }
}

export const checkIfLoggedIn = () => {
  return (dispatch, getState) => {
    const stateAuthToken = getState().authToken;
    const localStorageAuthToken = localStorage.getItem('x-auth');

    if (stateAuthToken == "") {
      //if authToken is empty, check localStorage authToken value
      if (localStorageAuthToken) {
        return RestAPI.get_users_me(localStorageAuthToken).then(() =>{
          //login user, so authToken in localStorage will be set to redux store
          dispatch(loginUser(localStorageAuthToken));
        }).catch(err => {
          //logout user if token is not valid
          return dispatch(logoutUser());
        });
      } else {
        //if there is no token anywhere logout user
        return Promise.resolve(dispatch(logoutUser()));
      }
    } else {
      //check if authToken is valid if it is not empty
      return RestAPI.get_users_me(stateAuthToken).then(() =>{
        //loginUser so authToken in redux store will be available in localStorage
        dispatch(loginUser(stateAuthToken));
      }).catch(err => {
        //logout user if token is not valid
        return dispatch(logoutUser());
      });
    }
  };
}
