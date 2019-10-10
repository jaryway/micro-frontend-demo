import { createStore, combineReducers } from 'redux';
import { createHashHistory as createHistory } from 'history';
// import createHistory from 'history/createHashHistory';
export const history = createHistory();

const initialState = {
  refresh: 0,
};

function render(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH':
      return { ...state, refresh: state.refresh + 1 };
    default:
      return state;
  }
}

function to(state = initialState, action) {
  if (action.type !== 'to' && action.owner !== 'base') return { ...state, path: action.path };
  history.replace(action.path);

  return { ...state, path: action.path };
}

const globalReducers = { namespace: () => 'base', render, to };
export const storeInstance = createStore(combineReducers(globalReducers));
storeInstance.globalReducers = globalReducers;
