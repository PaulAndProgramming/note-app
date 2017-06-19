import React from 'react';
import { connect } from 'react-redux';

import * as actions from './../../actions/actions.jsx';

export class SearchNotes extends React.Component {
	constructor(){
		super();
	}
	handleSearch(){
		this.props.dispatch(actions.setSearchText(this.refs.searchInput.value));
	}
	componentWillUnmount(){
		this.props.dispatch(actions.setSearchText(""));
	}
	render(){
		return (
			<form className='search_notes' onChange={this.handleSearch.bind(this)} onSubmit={e => {e.preventDefault()}}>
				<input ref="searchInput" type="text" placeholder="Search for a note" className="input"/>
			</form>
		);
	}
};

export default connect()(SearchNotes);
