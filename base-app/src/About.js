import React, { forwardRef } from 'react';
// import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
import injectReducer from './utils/injectReducer';
const refg = React.createRef();
const About = forwardRef(({ name = '', updateUserName = () => {} }, ref) => {
  return (
    <div className='' ref={ref}>
      <p>About {name}</p>
      {/* <FancyButtonCom ref={refg}></FancyButtonCom> */}
      <Button
        onClick={() => {
          //   addTodo();
          console.log('refg', refg);
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

const Connect = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(About);

const Next = forwardRef((props, ref) => {
  return <Connect ref={ref} {...props}></Connect>;
});

export default withReducer(Next);






// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   null,
//   { forwardRef: true }
// )(About);

// const FancyButton = React.forwardRef((props, ref) => (
//   <button ref={ref} className='FancyButton'>
//     {props.children}
//   </button>
// ));

// You can now get a ref directly to the DOM button:

// const FancyButtonCom = React.forwardRef((props, ref) => {
//   return (
//     <FancyButton {...props} ref={ref}>
//       Click me!
//     </FancyButton>
//   );
// });
