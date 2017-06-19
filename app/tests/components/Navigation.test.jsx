import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import * as actions from 'actions/actions.jsx';
import { Navigation } from 'components/Navigation.jsx';

describe('Navigation.jsx', () => {

it('should exist', () => {
  expect(Navigation).toExist();
});

it('should dispatch logoutUser action on .logout click', () => {
  const spy = expect.createSpy();
  const authToken = "test123";
  let navigationInRouter = ReactTestUtils.renderIntoDocument(
    <Router>
      <Navigation dispatch={spy} authToken={authToken}/>
    </Router>
  );
  let navigation = ReactTestUtils.scryRenderedComponentsWithType(navigationInRouter, Navigation)[0]
  let logoutButtonElement = ReactDOM.findDOMNode(navigation).getElementsByClassName('logout')[0];
  ReactTestUtils.Simulate.click(logoutButtonElement);

  const expectedAction = actions.logoutUser(authToken);
  expect(spy).toHaveBeenCalledWith(expectedAction);
});

it('should render .logout when authToken is not empty', () => {
  const authToken = "test123";
  let navigationInRouter = ReactTestUtils.renderIntoDocument(
    <Router>
      <Navigation authToken={authToken}/>
    </Router>
  );
  let logoutButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(navigationInRouter, "logout");

  expect(logoutButton.length).toBe(1);
});

it('should not render .logout when authToken is empty', () => {
  const authToken = "";
  let navigationInRouter = ReactTestUtils.renderIntoDocument(
    <Router>
      <Navigation authToken={authToken}/>
    </Router>
  );
  let logoutButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(navigationInRouter, "logout");

  expect(logoutButton.length).toBe(0);
});

it('should render "All notes" on link to root if authToken is not empty', () => {
  const authToken = "test123";
  let navigationInRouter = ReactTestUtils.renderIntoDocument(
    <Router>
      <Navigation authToken={authToken}/>
    </Router>
  );
  let testLinkToRoot = ReactTestUtils.scryRenderedComponentsWithType(navigationInRouter, Link)[0];
  let linkToRoot = ReactDOM.findDOMNode(testLinkToRoot);
  expect(linkToRoot.innerHTML).toEqual("All notes");
});

it('should render "Login" on link to root if authToken is empty', () => {
  const authToken = "";
  let navigationInRouter = ReactTestUtils.renderIntoDocument(
    <Router>
      <Navigation authToken={authToken}/>
    </Router>
  );
  let testLinkToRoot = ReactTestUtils.scryRenderedComponentsWithType(navigationInRouter, Link)[0];
  let linkToRoot = ReactDOM.findDOMNode(testLinkToRoot);
  expect(linkToRoot.innerHTML).toEqual("Login");
});
});
