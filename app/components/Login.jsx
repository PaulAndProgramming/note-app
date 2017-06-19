import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions/actions.jsx';

export class Login extends React.Component {
	constructor(){
		super();
		this.state = {
			loggingIn: false,
			falseLogin: false
		};
	}
	componentDidMount(){
		//UX & UI
		this.refs.email.focus();
	}
	startUserLogin(evt){
		evt.preventDefault();
		this.setState({loggingIn: true});
		const email = this.refs.email.value;
		const password = this.refs.password.value;

		this.props.dispatch(actions.startUserLogin(email, password)).catch(err => {
			this.setState({
				loggingIn: false,
				falseLogin: true
			});
		});
	}
	render(){
		const FalseLoginElement = () => {
			if (!this.state.falseLogin) return null;
			return <div className="invalidinput">Username or password is invalid</div>;
		};
		return (
			<form className={"login" + (this.state.falseLogin ? " warning" : "")} onSubmit={this.startUserLogin.bind(this)}>
				<div>Login</div>
				<input type="text" placeholder="Email" className="input" ref="email"/>
				<input type="password" placeholder="Password" className="input" ref="password"/>
				<FalseLoginElement/>
				<button className="button">{this.state.loggingIn ? "Logging in..." : "Login"}</button>
			</form>
		);
	}
}

export default connect()(Login);
