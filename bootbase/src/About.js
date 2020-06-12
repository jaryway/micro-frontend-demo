import React, { forwardRef } from 'react';
// import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
import injectReducer from './utils/injectReducer';

const About = forwardRef(({ name = '', updateUserName = () => {} }, ref) => {
  return (
    <div className='' ref={ref}>
      <p>About {name}</p>
      {/* <FancyButtonCom ref={refg}></FancyButtonCom> */}
      <Button
        onClick={() => {
          //   addTodo();
          // console.log('refg', refg);
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
});

const withReducer = injectReducer(
  {
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
  },
  { forwardRef: true }
);
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
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(About)
);
