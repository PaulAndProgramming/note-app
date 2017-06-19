import React from 'react';
import { connect } from 'react-redux';

import * as actions from './../../actions/actions.jsx';

export class AddNewNote extends React.Component {
	constructor(){
		super();
	}
  handleAddNewNote(evt){
    evt.preventDefault();

		const newNoteInputElement = this.refs.newNoteInput;
		if (newNoteInputElement.value != "") {
			this.props.dispatch(actions.startAddingNewNote(newNoteInputElement.value));
		}
    newNoteInputElement.value = "";
		newNoteInputElement.focus();
  }
	render(){
		return (
			<form className='add_new_note' onSubmit={this.handleAddNewNote.bind(this)}>
				<input ref="newNoteInput" type="text" className="input"/>
        <button type="submit" className="button">Add note</button>
			</form>
		);
	}
}

export default connect()(AddNewNote);
