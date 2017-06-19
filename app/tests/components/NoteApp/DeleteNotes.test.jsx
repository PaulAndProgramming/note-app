import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';

import * as actions from 'actions/actions.jsx';
import { DeleteNotes } from 'components/NoteApp/DeleteNotes.jsx';

describe('DeleteNotes.jsx', () => {

  const notes = [{
    //other, non-important values
    id: "test123",
    selected: false
  }, {
    //other, non-important values
    id: "test124",
    selected: true
  }, {
    //other, non-important values
    id: "test125",
    selected: false
  }, {
    //other, non-important values
    id: "test126",
    selected: false
  }, {
    //other, non-important values
    id: "test127",
    selected: true
  }];

  it('it should exist', () => {
    expect(DeleteNotes).toExist();
  });

  it('it should dispatch selectAllNotes action on "Select All" button click', () => {
    const spy = expect.createSpy();
    let note = ReactTestUtils.renderIntoDocument(<DeleteNotes notes={notes} dispatch={spy}/>);
    let selectAllButton = ReactDOM.findDOMNode(note).getElementsByClassName('input')[0];
    ReactTestUtils.Simulate.click(selectAllButton);
    expect(spy).toHaveBeenCalledWith(actions.selectAllNotes());
  });

  it('it should dispatch deselectAllNotes action on "Deselect All" button click', () => {
    const spy = expect.createSpy();
    let note = ReactTestUtils.renderIntoDocument(<DeleteNotes notes={notes} dispatch={spy}/>);
    let deselectAllButton = ReactDOM.findDOMNode(note).getElementsByClassName('input')[1];
    ReactTestUtils.Simulate.click(deselectAllButton);
    expect(spy).toHaveBeenCalledWith(actions.deselectAllNotes());
  });

  it('it should dispatch startDeletingNotes action and pass correct id\'s on "Delete selected" button click', () => {
    const spy = expect.createSpy();
    let note = ReactTestUtils.renderIntoDocument(<DeleteNotes notes={notes} dispatch={spy}/>);
    let deleteSelectedButton = ReactDOM.findDOMNode(note).getElementsByClassName('input')[2];
    ReactTestUtils.Simulate.click(deleteSelectedButton);

    expect(spy).toHaveBeenCalledWith(actions.startDeletingNotes(["test125", "test127"]));
  });

  it('it should display correct number of selected elements in "Delete selected" button', () => {
    const spy = expect.createSpy();
    let note = ReactTestUtils.renderIntoDocument(<DeleteNotes notes={notes} dispatch={spy}/>);
    let numberElement = ReactDOM.findDOMNode(note).getElementsByClassName('input')[2].getElementsByTagName('div')[0];
    const numberInNumberElement = numberElement.innerHTML;
    expect(numberInNumberElement).toEqual(2);
  });

});
