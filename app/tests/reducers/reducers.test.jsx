import expect from 'expect';
import df from 'deep-freeze-strict';//checks if objects/values were not altered

import * as reducers from 'reducers/reducers.jsx';

describe('Reducers', () => {

  describe('searchTextReducer', () => {
    it('should set search text', () => {
      const action = {
        type: 'SET_SEARCH_TEXT',
        text: "some text"
      };
      const res = reducers.searchTextReducer(df(''), df(action));

      expect(res).toEqual(action.text);
    });
  });

  describe('notesReducer', () => {
    const notes = [{
      text: "Test text 1",
      date_added: 132123,
      id: "123a",
      selected: true
    }, {
      text: "Test text 2",
      date_added: 132124,
      id: "123b",
      selected: true
    }, {
      text: "Test text 3",
      date_added: 132125,
      id: "123c",
      selected: false
    }];

    it('should add all notes', () => {
      const action = {
        type: 'ADD_ALL_NOTES',
        notes: notes
      };
      const res = reducers.notesReducer(df([]), df(action));

      expect(res).toEqual(action.notes);
    });

    it('should add a new note', () => {
      const note = {
        text: "Test text 1",
        date_added: 132123,
        key: "123a"
      };
      const action = {
        type: 'ADD_NEW_NOTE',
        note: note
      };
      const res = reducers.notesReducer(df([]), df(action));

      expect(res.length).toEqual(1);
      expect(res[0]).toEqual(note);
    });

    it('should delete notes by id', () => {
      const noteIds = ["123a", "123b"];
      const action = {
        type: 'DELETE_SELECTED_NOTES',
        noteIds: noteIds
      };
      const res = reducers.notesReducer(df(notes), df(action));

      expect(res.length).toEqual(1);
      expect(res[0]).toEqual(notes[2]);
    });

    it('should toggle note selected', () => {
      const noteId = "123a";
      const action = {
        type: 'TOGGLE_NOTE_SELECTED',
        noteId: noteId
      };
      const res = reducers.notesReducer(df(notes), df(action));

      expect(res.length).toEqual(notes.length);
      expect(res[0].selected).toEqual(false);
      expect(res[1].selected).toEqual(true);
      expect(res[2].selected).toEqual(false);
    });

    it('should select all notes', () => {
      const action = {
        type: 'SELECT_ALL_NOTES'
      };
      const res = reducers.notesReducer(df(notes), df(action));

      expect(res.length).toEqual(notes.length);
      expect(res[0].selected).toEqual(true);
      expect(res[1].selected).toEqual(true);
      expect(res[2].selected).toEqual(true);
    });

    it('should deselect all notes', () => {
      const action = {
        type: 'DESELECT_ALL_NOTES'
      };
      const res = reducers.notesReducer(df(notes), df(action));

      expect(res.length).toEqual(notes.length);
      expect(res[0].selected).toEqual(false);
      expect(res[1].selected).toEqual(false);
      expect(res[2].selected).toEqual(false);
    });
  });

  describe('authTokenReducer', () => {
    it('should login user', () => {
      const authToken = "test.123.token";
      const action = {
        type: 'LOGIN_USER',
        authToken: authToken
      };
      const res = reducers.authTokenReducer(df(''), df(action));

      expect(res).toEqual(action.authToken);
    });

    it('should logout user', () => {
      const authToken = "test.123.token";
      const action = {
        type: 'LOGOUT_USER'
      };
      const res = reducers.authTokenReducer(df(authToken), df(action));

      expect(res).toEqual("");
    });
  });

});
