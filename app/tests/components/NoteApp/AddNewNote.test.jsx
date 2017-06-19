import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';

import * as actions from 'actions/actions.jsx';
import { AddNewNote } from 'components/NoteApp/AddNewNote.jsx';

describe('AddNewNote.jsx', () => {
  it('should exist', () => {
    expect(AddNewNote).toExist();
  });

  it('should dispatch startADdingNewNote action on "Add note" button click', () => {
    const spy = expect.createSpy();
    const newNoteText = "Test new note next";
    let addNewNote = ReactTestUtils.renderIntoDocument(<AddNewNote dispatch={spy}/>);
    let formElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(addNewNote, "add_new_note")[0];
    addNewNote.refs.newNoteInput.value = newNoteText;
    ReactTestUtils.Simulate.submit(formElement);

    expect(spy).toHaveBeenCalledWith(actions.startAddingNewNote(newNoteText+"a"));
  });

  it('should not dispatch startADdingNewNote action if input value is empty', () => {
    const spy = expect.createSpy();
    const newNoteText = "";
    let addNewNote = ReactTestUtils.renderIntoDocument(<AddNewNote dispatch={spy}/>);
    let formElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(addNewNote, "add_new_note")[0];
    addNewNote.refs.newNoteInput.value = newNoteText;
    ReactTestUtils.Simulate.submit(formElement);

    expect(spy).toNotHaveBeenCalled();
  });

  it('should clear input value after "Add note" button click', () => {
    const dispatch = f => f;//not needed in test so this will be enough to not throw any errors
    const newNoteText = "Test new note next";
    let addNewNote = ReactTestUtils.renderIntoDocument(<AddNewNote dispatch={dispatch}/>);
    let formElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(addNewNote, "add_new_note")[0];
    addNewNote.refs.newNoteInput.value = newNoteText;
    ReactTestUtils.Simulate.submit(formElement);
    expect(addNewNote.refs.newNoteInput.value).toBe("");
  });
});
