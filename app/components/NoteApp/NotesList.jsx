import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions/actions.jsx';
import Note from 'components/NoteApp/Note.jsx';

export class NotesList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			//will be used for scrolling down if any notes added
			previousNotesArrayLength: this.props.notes.length
		};
	}
	componentDidUpdate(){
		//scroll to bottom only if new note was added, do not scroll on re-render
		if (this.state.previousNotesArrayLength != this.props.notes.length) {
			let allNotesElement = this.refs.allNotes;
			allNotesElement.scrollTop = allNotesElement.scrollHeight;
			this.setState({
				previousNotesArrayLength: this.props.notes.length
			});
		}
	}
	getFilteredNotes() {
		return this.props.notes.filter(note => {
			return note.text.toLowerCase().indexOf(this.props.searchText.toLowerCase()) !== -1;
		}).map(note => {
			return <Note noteInfo={note} key={note.id} />;
		});
	}
	render(){
		const filteredNotes = this.getFilteredNotes();

		return (
			<div ref="allNotes" className='all_notes'>
				{filteredNotes.length != 0 ? filteredNotes : <div className="empty">There are no notes...</div>}
			</div>
		);
	}
};

export default connect(
	(state) => {
		return {
			notes: state.notes,
			searchText: state.searchText
		};
	}
)(NotesList);
