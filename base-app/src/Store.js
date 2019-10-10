import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createHashHistory as createHistory } from 'history';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import httpMiddleware from './middleware/httpMiddleware';

export const history = createHistory();
const appReducers = {};
const moduleHotFile = './_global/reducers/index.js';
const initialState = { refresh: 0 };
const middlewares = [thunk, promiseMiddleware({ promiseTypeDelimiter: '/' }), httpMiddleware];
let devtools = () => noop => noop;

if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__;
}

const enhancers = [
  applyMiddleware(...middlewares),
  devtools(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS),
];

function render(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH': {
      console.log('REFRESH-base', action);
      return { ...state, refresh: state.refresh + 1 };
    }
    default:
      return state;
  }
}

function to(state = initialState, action) {
  if (action.type !== 'to' && action.owner !== 'base') return { ...state, path: action.path };
  // history.replace(action.path);

  return { ...state, path: action.path };
}

const globalReducers = { namespace: () => 'base', render, to, ...(appReducers || {}) };

export const storeInstance = createStore(
  combineReducers(globalReducers),
  {},
  compose(...enhancers)
);
storeInstance.globalReducers = globalReducers;
console.log('storeInstance', storeInstance);
// 适配 热更新
if (module.hot && moduleHotFile) {
  module.hot.accept(moduleHotFile, () => {
    console.log('module.hot.accept');
    const reducers = { ...storeInstance.globalReducers, ...(storeInstance.injectedReducers || {}) };
    storeInstance.replaceReducer(combineReducers(reducers));
  });
}
