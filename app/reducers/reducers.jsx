export const searchTextReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return action.text;
    default:
      return state;
  };
};

export const notesReducer = (state = [], action) => {
  switch(action.type) {
    case "ADD_ALL_NOTES":
      return action.notes;
    case "ADD_NEW_NOTE":
      return [
        ...state,
        action.note
      ];
    case "DELETE_SELECTED_NOTES":
      return state.filter(note => {
        if (action.noteIds.indexOf(note.id) === -1) return true;
      });
    case "TOGGLE_NOTE_SELECTED":
      return state.map(note => {
        if (note.id == action.noteId) {
          return {
            ...note,
            selected: !note.selected
          };
        }
        return note;
      });
    case "SELECT_ALL_NOTES":
      return state.map(note => {
        return {
          ...note,
          selected: true
        };
      });
    case "DESELECT_ALL_NOTES":
      return state.map(note => {
        return {
          ...note,
          selected: false
        };
      });
    default:
      return state;
  }
};

export const authTokenReducer = (state = "", action) => {
  switch(action.type) {
    case "LOGIN_USER":
      return action.authToken
    case "LOGOUT_USER":
      return "";
    default:
      return state;
  }
};
