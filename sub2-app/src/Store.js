import { createStore, combineReducers, compose } from 'redux';
import { createBrowserHistory as createHistory } from 'history';
// import createHistory from 'history/createHashHistory';
export const history = createHistory();

const initialState = { refresh: 0 };

function render(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH':
      return { ...state, refresh: state.refresh + 1 };
    default:
      return state;
  }
}

function to(state = initialState, action) {
  if (action.type !== 'to' && action.owner !== 'sub1-app') return { ...state, path: action.path };
  history.replace(action.path);

  return { ...state, path: action.path };
}
function _root(state = { rootActiveMenuKey: '' }, action) {
  if (action.type === 'CHANGE_ROOT_ACTIVE_MENU_KEY') {
    return { ...state, rootActiveMenuKey: action.payload };
  }

  return state;
}

const globalReducers = { namespace: () => 'sub2', render, to, _root };
const createReducer = (asyncReducers) => {
  console.log('sub2-app.createReducer', asyncReducers);
  const appReducer = combineReducers(asyncReducers);
  return (state, action) => {
    console.log('sub2-app.createReducer.1', action, state);
    // 把这个 app 的 state 设为初始值，依赖 hsp-utils > 1.3
    if (action.type === 'RESET_APP') {
      console.log('sub2-app.createReducer.RESET_APP', action);
      state = undefined;
    }
    return appReducer(state, action);
  };
};

export const storeInstance = createStore(createReducer(globalReducers), {});
storeInstance.globalReducers = globalReducers;
storeInstance.createReducer = createReducer;
