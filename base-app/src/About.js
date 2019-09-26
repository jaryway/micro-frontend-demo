import React from 'react';
// import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
import injectReducer from './utils/injectReducer';

function About({ name = '', updateUserName = () => {}, addTodo, ...props }) {
  return (
    <div className=''>
      <p>{name}</p>
      <Button
        onClick={() => {
          //   addTodo();
          updateUserName(
            Math.random()
              .toString(16)
              .substring(2)
          );
        }}
      >
        ChangeName
      </Button>
    </div>
  );
}

const withReducer = injectReducer({
  key: 'about',
  reducer: (state = { name: 'about' }, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'UPDATE_ABOUT_NAME':
        return { ...state, name: payload };
      default:
        return state;
    }
  },
});
const mapStateToProps = state => {
  return state.about;
};
const mapDispatchToProps = dispatch => {
  return {
    updateUserName: value => dispatch({ type: 'UPDATE_ABOUT_NAME', payload: value }),
    addTodo: () =>
      dispatch({
        type: 'ADD_TODO',
        text: 'Use Redux',
      }),
  };
};

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(About)
);
