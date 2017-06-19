import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';

import { SearchNotes } from 'components/NoteApp/SearchNotes.jsx';

describe('SearchNotes', () => {
  it('should exist', () => {
    expect(SearchNotes).toExist();
  });

  it('should dispatch setSearchText action on input change', () => {
    const spy = expect.createSpy();
    const newSearchText = "New search text";
		const action = {
			type: "SET_SEARCH_TEXT",
			text: newSearchText
		};
		const searchNotes = ReactTestUtils.renderIntoDocument(<SearchNotes dispatch={spy}/>);
		searchNotes.refs.searchInput.value = newSearchText;
		ReactTestUtils.Simulate.change(searchNotes.refs.searchInput);
		expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch setSearchText action with empty string on input change', () => {
    const spy = expect.createSpy();
    const newSearchText = "";
		const action = {
			type: "SET_SEARCH_TEXT",
			text: newSearchText
		};
		const searchNotes = ReactTestUtils.renderIntoDocument(<SearchNotes dispatch={spy}/>);
    const searchNotesContainer = ReactDOM.findDOMNode(searchNotes).parentNode;
    ReactDOM.unmountComponentAtNode(searchNotesContainer);
    expect(spy).toHaveBeenCalledWith(action);
  });
});
