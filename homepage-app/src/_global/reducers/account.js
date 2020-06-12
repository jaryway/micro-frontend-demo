import { handleActions } from 'redux-actions';

const initialState = {
  currentEmp: {},
  currentEmpLoading: true,
};

const reducers = handleActions(
  {
    ACCOUNT: {
      GET_CURRENT: {
        PENDING: (state, action) => {
          return {
            ...state,
            currentEmp: action.payload,
            currentEmpLoading: true,
          };
        },

        FULFILLED: (state, action) => {
          console.log('homepage-app.GET_CURRENT/FULFILLED', action);
          return {
            ...state,
            currentEmp: (action.payload || {}).data || {},
            currentEmpLoading: false,
          };
        },
        REJECTED: state => {
          // console.log("REJECTED", state, action);
          return {
            ...state,
            currentEmp: {},
            currentEmpLoading: true,
          };
        },
      },
    },
  },
  initialState
);

export default reducers;
