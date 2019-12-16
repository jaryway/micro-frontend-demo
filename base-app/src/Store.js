import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createHashHistory as createHistory } from 'history';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import httpMiddleware from './middleware/httpMiddleware';

export const history = createHistory();
// const appReducers = {};
// const moduleHotFile = './_global/reducers/index.js';
const initialState = { refresh: 0 };
// const initialState1 = { registerApps: [] };
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
      // console.log('REFRESH-base', action);
      return { ...state, refresh: state.refresh + 1 };
    }
    default:
      return state;
  }
}

function to(state = initialState, action) {
  if (action.type !== 'to' && action.owner !== 'base') return { ...state, path: action.path };
  history.replace(action.path);

  return { ...state, path: action.path };
}

function _root(state = { registerApps: [], rootActiveMenuKey: '' }, action) {
  if (action.type === 'REGISTER_APP') {
    console.log('base-app.REGISTER_APP', action, state);
    return { ...state, registerApps: [...state.registerApps, action.payload] };
  }

  if (action.type === 'MOUNT_APP') {
    const { registerApps } = state;
    console.log('base-app.MOUNT_APP', action, registerApps);

    for (let i = 0; i < registerApps.length; i++) {
      const registerApp = registerApps[i];
      registerApp.mount();
    }

    return { ...state, registerApps: [] };
  }

  if (action.type === 'CHANGE_ROOT_ACTIVE_MENU_KEY') {
    console.log('base-app.CHANGE_ROOT_ACTIVE_MENU_KEY', action, state);
    return { ...state, rootActiveMenuKey: action.payload };
  }

  return state;
}

const globalReducers = { namespace: () => 'base', render, to, _root };
const createReducer = asyncReducers => {
  console.log('base-app.createReducer', asyncReducers);
  const appReducer = combineReducers(asyncReducers);
  return (state, action) => {
    console.log('base-app.createReducer.1', action, state);
    // 把这个 app 的 state 设为初始值，依赖 hsp-utils > 1.3
    if (action.type === 'RESET_APP') {
      console.log('base-app.createReducer.RESET_APP', action);
      state = undefined;
    }
    return appReducer(state, action);
  };
};

export const storeInstance = createStore(createReducer(globalReducers), {}, compose(...enhancers));
storeInstance.globalReducers = globalReducers;
storeInstance.createReducer = createReducer;

// // console.log('storeInstance', storeInstance);
// // 适配 热更新
// if (module.hot && moduleHotFile) {
//   module.hot.accept(moduleHotFile, () => {
//     console.log('module.hot.accept');
//     const reducers = { ...storeInstance.globalReducers, ...(storeInstance.injectedReducers || {}) };
//     storeInstance.replaceReducer(combineReducers(reducers));
//   });
// }
