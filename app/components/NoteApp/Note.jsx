import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions/actions.jsx';

export class Note extends React.Component {
	constructor(){
		super();
	}
	//turns date in ms to a string date
	dateToString(dateInMs){
		if (typeof dateInMs != 'number') return null;
		const
			date = new Date(dateInMs),
			year = date.getFullYear(),
			month = date.getMonth()+1,
			day = date.getDate(),
			hours24 = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;
		let pmOrAm, hours;
		if (hours24 >= 12) {
			pmOrAm = "PM";
			hours = hours24 == 12 ? hours24 : hours24 - 12;
		} else {
			pmOrAm = "AM";
			hours = hours24 == 0 ? 12 : hours24;
		}

		return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} ${pmOrAm}`;
	}
	toggleCheck(){
		this.props.dispatch(actions.toggleNoteSelected(this.props.noteInfo.id));
	}
	render(){
		const noteInfo = this.props.noteInfo;
		const isSelected = noteInfo.selected;
		const noteDate = this.dateToString(noteInfo.date_added);
		return (
			<div className='note'>
				<div>{noteInfo.text}</div>
				<div>{noteDate}</div>
				<div className={isSelected ? "selected " : ""} onClick={this.toggleCheck.bind(this)} ref="checkButton"><div></div></div>
			</div>
		);
	}
}

export default connect()(Note);
