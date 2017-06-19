import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'store/configureStore.jsx';
import * as actions from 'actions/actions.jsx'
import { Login } from 'components/Login.jsx';

describe('Login.jsx', () => {
  it('should exist', () => {
    expect(Login).toExist();
  });

  it('should render div.invalidinput only when state.falseLogin is false', () => {
    let login = ReactTestUtils.renderIntoDocument(<Login/>);
    let invalidInputElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "invalidinput")[0];
    expect(invalidInputElement).toNotExist();

    login.setState({falseLogin: true});

    invalidInputElement = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "invalidinput")[0];
    expect(invalidInputElement).toExist();
  });

  it('should add class .warning only when state.falseLogin is false', () => {
    let login = ReactTestUtils.renderIntoDocument(<Login/>);
    let loginForm = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "login")[0];
    let hasWarningClass = loginForm.className.indexOf(" warning") === -1 ? false : true;
    expect(hasWarningClass).toEqual(false);

    login.setState({falseLogin: true});

    hasWarningClass = loginForm.className.indexOf(" warning") === -1 ? false : true;
    expect(hasWarningClass).toEqual(true);
  });

  it('should write "Logging in..." on login button only when state.loggingIn is true', () => {
    let login = ReactTestUtils.renderIntoDocument(<Login/>);
    let loginForm = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "login")[0];
    let hasWarningClass = loginForm.className.indexOf(" warning") === -1 ? false : true;
    expect(hasWarningClass).toEqual(false);

    login.setState({falseLogin: true});

    hasWarningClass = loginForm.className.indexOf(" warning") === -1 ? false : true;
    expect(hasWarningClass).toEqual(true);
  });

  it('should write "Logging in..." on login button only when state.loggingIn is true', () => {
    let login = ReactTestUtils.renderIntoDocument(<Login/>);
    let loginButton = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "button")[0];
    expect(loginButton.innerHTML).toEqual("Login");

    login.setState({loggingIn: true});

    expect(loginButton.innerHTML).toEqual("Logging in...");
  });

  it('should dispatch startUserLogin action on login form submit', () => {
    const spy = expect.createSpy(() => Promise.reject()).andCallThrough();
    let login = ReactTestUtils.renderIntoDocument(<Login dispatch={spy}/>);
    let loginForm = ReactTestUtils.scryRenderedDOMComponentsWithClass(login, "login")[0];
    const email = "wrongEmail";
    const password = "wrongPassword";
    login.refs.email.value = email;
    login.refs.password.value = password;
    ReactTestUtils.Simulate.submit(loginForm);
    expect(spy).toHaveBeenCalledWith(actions.startUserLogin(email, password));
  });
});
