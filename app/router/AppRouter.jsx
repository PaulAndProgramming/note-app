import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import * as actions from 'actions/actions.jsx';
import About from 'components/About.jsx';
import Login from 'components/Login.jsx';
import Navigation from 'components/Navigation.jsx';
import NoteApp from 'components/NoteApp/NoteApp.jsx';

export class AppRouter extends React.Component {
  constructor(props){
    super(props);
    this.props.dispatch(actions.checkIfLoggedIn());
  }
  checkIfLoggedIn() {
    const isLoggedIn = (this.props.authToken && this.props.authToken.length > 0);
    if (isLoggedIn) {
  		this.props.dispatch(actions.startFetchingNotes());
      return <NoteApp/>;
    } else {
      return <Login/>;
    }
  }
  render(){
    return (
      <Router>
      	<div>
      		<Navigation />
          <div className="content">
            <Switch>
              <Route path="/" exact render={this.checkIfLoggedIn.bind(this)}/>
              <Route path="/about" component={About}/>
              <Route render={() => <Redirect to="/" />}/>
            </Switch>
          </div>
      	</div>
      </Router>
    );
  }
}

export default connect((state) => {
  return {
    authToken: state.authToken
  }
})(AppRouter);
