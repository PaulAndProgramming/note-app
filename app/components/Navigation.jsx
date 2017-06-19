import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from 'actions/actions.jsx';

export class Navigation extends React.Component {
	constructor(){
		super();
	}
	logout(){
		this.props.dispatch(actions.logoutUser(this.props.authToken));
	}
	render(){
		const isLoggedIn = (this.props.authToken && this.props.authToken.length > 0);
		return (
			<nav className="navigation">
				{isLoggedIn && <a className="logout" onClick={this.logout.bind(this)}>Logout</a>}
				<Link to="/">{isLoggedIn ? "All notes" : "Login"}</Link>
				<Link to="/about">About</Link>
			</nav>
		);
	}
}

export default connect((state) => {
  return {
    authToken: state.authToken
  }
})(Navigation);
