import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';

import * as actions from 'actions/actions.jsx';
import { Note } from 'components/NoteApp/Note.jsx';

describe('Note.jsx', () => {
  it('should exist', () => {
    expect(Note).toExist();
  });

  describe('dateToString function', () => {
    it('it should add zeros to minutes, seconds but not hours, months, days if they are <10', () => {
      let note = ReactTestUtils.renderIntoDocument(<Note noteInfo={{}}/>);

      const timeToTestInMs1 = new Date('2011-04-09T09:09:09').getTime();
      const result1 = note.dateToString(timeToTestInMs1);
      const expectedResult1 = '2011/4/9 9:09:09 AM';

      const timeToTestInMs2 = new Date('2011-01-01T01:00:00').getTime();
      const result2 = note.dateToString(timeToTestInMs2);
      const expectedResult2 = '2011/1/1 1:00:00 AM';

      const timeToTestInMs3 = new Date('2011-11-11T11:11:11').getTime();
      const result3 = note.dateToString(timeToTestInMs3);
      const expectedResult3 = '2011/11/11 11:11:11 AM';

      expect(result1).toBe(expectedResult1);
      expect(result2).toBe(expectedResult2);
      expect(result3).toBe(expectedResult3);
    });

    it('it should correctly return midnight time', () => {
      let note = ReactTestUtils.renderIntoDocument(<Note noteInfo={{}}/>);
      const timeToTestInMs = new Date('2011-11-11T00:00:00Z').getTime();
      const result = note.dateToString(timeToTestInMs);
      const expectedResult = '2011/11/11 12:00:00 AM';
      expect(result).toBe(expectedResult);
    });

    it('it should return null if typeof argument is not a number', () => {
      let note = ReactTestUtils.renderIntoDocument(<Note noteInfo={{}}/>);

      const result1 = note.dateToString("someString");
      const expectedResult1 = null;

      const result2 = note.dateToString(undefined);
      const expectedResult2 = null;

      expect(result1).toBe(expectedResult1);
      expect(result2).toBe(expectedResult2);
    });
  });

  it('it should add selected class to select button if a note is selected', () => {
    const noteInfo = {
      //other, non-related values
      selected: true
    };
		let note = ReactTestUtils.renderIntoDocument(<Note noteInfo={noteInfo}/>);
    let selectButton = note.refs.checkButton;
    const isSelected = selectButton.className.indexOf("selected ") === -1 ? false : true;
    expect(isSelected).toBe(true);
  });

  it('it should dispatch toggleNoteSelected action on click', () => {
    const spy = expect.createSpy();
    const noteInfo = {
      //other, non-related values
      selected: true,
      id: "test123"
    };
    let note = ReactTestUtils.renderIntoDocument(<Note noteInfo={noteInfo} dispatch={spy}/>);
    let selectButton = note.refs.checkButton;
    ReactTestUtils.Simulate.click(selectButton);
    expect(spy).toHaveBeenCalledWith(actions.toggleNoteSelected(noteInfo.id));
  });
});
