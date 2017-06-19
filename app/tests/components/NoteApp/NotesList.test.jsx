import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'store/configureStore.jsx';
import * as actions from 'actions/actions.jsx'
import NotesListConnected, { NotesList } from 'components/NoteApp/NotesList.jsx';
import { Note } from 'components/NoteApp/Note.jsx';

describe('NotesList.jsx', () => {
  const notes = [{
    //other, non-important values
    text: "test123123123",
    id: "test123",
    selected: false
  }, {
    //other, non-important values
    text: "test12343213",
    id: "test124",
    selected: true
  }, {
    //other, non-important values
    text: "test123123",
    id: "test125",
    selected: false
  }, {
    //other, non-important values
    text: "abcd123213",
    id: "test126",
    selected: false
  }, {
    //other, non-important values
    text: "abcd1231231",
    id: "test127",
    selected: true
  }];

  it('should exist', () => {
    expect(NotesList).toExist();
  });

  describe('getFilteredNotes function', () => {
    it('should return notes that has sarched text inside them', () => {
      const store = configureStore({
        notes: notes,
        searchText: "abcd"
      });
      let provider = ReactTestUtils.renderIntoDocument(
        <Provider store={store}>
          <NotesListConnected/>
        </Provider>
      );
      let notesList = ReactTestUtils.scryRenderedComponentsWithType(provider, NotesList)[0];
      expect(notesList.getFilteredNotes().length).toBe(2);
    });

    it('should return all notes if searched text is empty', () => {
      const store = configureStore({
        notes: notes,
        searchText: ""
      });
      let provider = ReactTestUtils.renderIntoDocument(
        <Provider store={store}>
          <NotesListConnected/>
        </Provider>
      );
      let notesList = ReactTestUtils.scryRenderedComponentsWithType(provider, NotesList)[0];
      expect(notesList.getFilteredNotes().length).toBe(notes.length);
    });
  });

  it('should render <Note/> array without div.empty if notes array is not empty', () => {
    const store = configureStore({
      notes: notes,
      searchText: ""
    });
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NotesListConnected/>
      </Provider>
    );
    let noNotesElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(provider, "empty")[0];
    let NoteArray = ReactTestUtils.scryRenderedComponentsWithType(provider, Note);

    expect(noNotesElement).toNotExist();
    expect(NoteArray.length).toEqual(notes.length);
  });

  it('should display div.empty without <Note/> array if notes array is empty', () => {
    const store = configureStore({
      notes: [],
      searchText: ""
    });
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NotesListConnected/>
      </Provider>
    );
    let noNotesElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(provider, "empty")[0];
    let NoteArray = ReactTestUtils.scryRenderedComponentsWithType(provider, Note);

    expect(noNotesElement).toExist();
    expect(NoteArray.length).toEqual(0);
  });

  it('should display div.empty without <Note/> array if searchText does not mach any note', () => {
    const store = configureStore({
      notes: notes,
      searchText: "non-maching search text"
    });
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NotesListConnected/>
      </Provider>
    );
    let noNotesElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(provider, "empty")[0];
    let NoteArray = ReactTestUtils.scryRenderedComponentsWithType(provider, Note);

    expect(noNotesElement).toExist();
    expect(NoteArray.length).toEqual(0);
  });
});
