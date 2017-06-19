import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'store/configureStore.jsx';
import { AddNewNote } from 'components/NoteApp/AddNewNote.jsx';
import { DeleteNotes } from 'components/NoteApp/DeleteNotes.jsx';
import { NoteApp } from 'components/NoteApp/NoteApp.jsx';

describe('NoteApp', () => {
  it('should exist', () => {
    expect(NoteApp).toExist();
  });

  it('should not add "willdelete" class if there is more than 0 selected notes', () => {
    const notes = [{
      text: "Test text 123",
      selected: false
    }, {
      text: "Test text 123",
      selected: false
    }];
    const store = configureStore();
		let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NoteApp notes={notes}/>
      </Provider>
    );
    let testNoteApp = ReactTestUtils.scryRenderedComponentsWithType(provider, NoteApp)[0];
		const NoteAppElement = ReactDOM.findDOMNode(testNoteApp);
    const isWilldeleteClassAdded = NoteAppElement.className.indexOf(" willdelete") === -1 ? false : true;
		expect(isWilldeleteClassAdded).toBe(false);
  });

  it('should add "willdelete" class if there is more than 0 selected notes', () => {
    const notes = [{
      text: "Test text 123",
      selected: false
    }, {
      text: "Test text 123",
      selected: true
    }];
    const store = configureStore();
		let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NoteApp notes={notes}/>
      </Provider>
    );
    let testNoteApp = ReactTestUtils.scryRenderedComponentsWithType(provider, NoteApp)[0];
		const NoteAppElement = ReactDOM.findDOMNode(testNoteApp);
    const isWilldeleteClassAdded = NoteAppElement.className.indexOf(" willdelete") === -1 ? false : true;
		expect(isWilldeleteClassAdded).toBe(true);
  });

  it('should render AddNewNote component if there is not more than 0 notes selected', () => {
    const notes = [{
      text: "Test text 123",
      selected: false
    }, {
      text: "Test text 123",
      selected: false
    }];
    const store = configureStore();
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NoteApp notes={notes}/>
      </Provider>
    );
    let testAddNewNote = ReactTestUtils.scryRenderedComponentsWithType(provider, AddNewNote)[0];
    expect(testAddNewNote).toExist();
  });

  it('should render DeleteNotes component if there is more than 0 notes selected', () => {
    const notes = [{
      text: "Test text 123",
      selected: false
    }, {
      text: "Test text 123",
      selected: true
    }];
    const store = configureStore();
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <NoteApp notes={notes}/>
      </Provider>
    );
    let testDeleteNotes = ReactTestUtils.scryRenderedComponentsWithType(provider, DeleteNotes)[0];
    expect(testDeleteNotes).toExist();
  });
});
