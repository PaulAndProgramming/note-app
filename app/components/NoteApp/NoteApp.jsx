import React from 'react';
import { connect } from 'react-redux';

import AddNewNote from 'components/NoteApp/AddNewNote.jsx';
import DeleteNotes from 'components/NoteApp/DeleteNotes.jsx';
import NotesList from 'components/NoteApp/NotesList.jsx';
import SearchNotes from 'components/NoteApp/SearchNotes.jsx';

export class NoteApp extends React.Component {
	constructor(){
		super();
	}
	render(){
		let noNotesSelected = true;
		for (const note of this.props.notes) {
	    if (note.selected) noNotesSelected = false;
	  }
		return (
			<div className={"notes" + (noNotesSelected ? "" : " willdelete")}>
				<SearchNotes/>
				<NotesList/>
				{noNotesSelected ? <AddNewNote/> : <DeleteNotes/>}
			</div>
		);
	}
};

export default connect(
	(state) => {
		return {
			notes: state.notes
		};
	}
)(NoteApp);
