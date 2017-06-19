import expect from 'expect';
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'store/configureStore.jsx';
import * as actions from 'actions/actions.jsx';
import AppRouter from 'router/AppRouter.jsx';
import { Login } from 'components/Login.jsx';
import { NoteApp } from 'components/NoteApp/NoteApp.jsx';

describe('AppRouter.jsx', () => {
  it('should exist', () => {
    expect(AppRouter).toExist();
  });

  it('should render <NoteApp/> and not <Login/> component if authToken length is greater than 0', () => {
    let store = configureStore({
      authToken: "token123",
      notes: []
    });
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <AppRouter/>
      </Provider>
    );
    let noteAppComponent = ReactTestUtils.scryRenderedComponentsWithType(provider, NoteApp)[0];
    let loginComponent = ReactTestUtils.scryRenderedComponentsWithType(provider, Login)[0];

    expect(noteAppComponent).toExist();
    expect(loginComponent).toNotExist();
  });

  it('should render <Login/> and not <NoteApp/> component if authToken is empty', () => {
    let store = configureStore({
      authToken: ""
    });
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={store}>
        <AppRouter/>
      </Provider>
    );
    let noteAppComponent = ReactTestUtils.scryRenderedComponentsWithType(provider, NoteApp)[0];
    let loginComponent = ReactTestUtils.scryRenderedComponentsWithType(provider, Login)[0];

    expect(noteAppComponent).toNotExist();
    expect(loginComponent).toExist();
  });
});
