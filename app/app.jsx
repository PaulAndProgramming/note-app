import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'store/configureStore.jsx';

import AppRouter from 'router/AppRouter.jsx';

import './styles/styles.styl';

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AppRouter/>
  </Provider>
  , document.getElementById('app')
);
