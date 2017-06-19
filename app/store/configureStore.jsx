import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk'

import { searchTextReducer, notesReducer, authTokenReducer } from './../reducers/reducers.jsx';

const configureStore = (initialState = {}) => {
  const reducers = combineReducers({
    searchText: searchTextReducer,
    notes: notesReducer,
    authToken: authTokenReducer
  });
  let store = createStore(reducers, initialState, compose(
    applyMiddleware(thunk),
    process.env.NODE_ENV === 'production' ? f => f : (window.devToolsExtension ? window.devToolsExtension() : f => f)
  ));

  return store;
};

export default configureStore;
