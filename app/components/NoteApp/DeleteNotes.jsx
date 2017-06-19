import React from 'react';
import { connect } from 'react-redux';

import * as actions from './../../actions/actions.jsx';

export class DeleteNotes extends React.Component {
	constructor(){
		super();
	}
	selectAll(){
		this.props.dispatch(actions.selectAllNotes());
	}
	deselectAll(){
		this.props.dispatch(actions.deselectAllNotes());
	}
	deleteNotes(){
		const noteIdsToDelete = this.props.notes.filter(note => note.selected).map(note => note.id);
		this.props.dispatch(actions.startDeletingNotes(noteIdsToDelete));
	}
	render(){
		let numberOfSelectedNotes = 0;
		for (const note of this.props.notes) {
	    if (note.selected) numberOfSelectedNotes++;
	  }
		return (
			<div className="delete_notes">
				<div className="input" onClick={this.selectAll.bind(this)}>Select all</div>
				<div className="input" onClick={this.deselectAll.bind(this)}>Deselect all</div>
				<div className="input" onClick={this.deleteNotes.bind(this)}>
					<span>Delete selected</span>
					<div>{numberOfSelectedNotes}</div>
				</div>
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
)(DeleteNotes);
