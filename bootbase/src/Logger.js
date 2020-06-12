import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import injectReducer from './utils/injectReducer';

function logProps(WrappedComponent) {
  function LogProps({ forwardedRef, ...rest }) {
    return <WrappedComponent ref={forwardedRef} {...rest} />;
  }

  return forwardRef((props, ref) => {
    return <LogProps forwardedRef={ref} {...props} />;
  });
}

const Child = forwardRef(function({ txt }, ref) {
  return (
    <div style={{ margin: 16 }} ref={ref}>
      Child
      {txt}{' '}
    </div>
  );

  // return <S {...props} />;
});

const LogChild = forwardRef((props, ref) => {
  console.log('LogChild-ref', ref);
  const C = logProps(Child);

  return <C {...props} ref={ref}></C>;
});

const mapStateToProps = state => {
  return state.app || {};
};
const mapDispatchToProps = dispatch => {
  return {
    updateUserName: value => dispatch({ type: 'UPDATE_USER_NAME', payload: value }),
  };
};

const withReducer = injectReducer(
  {
    key: 'app',
    reducer: (state = { name: 'xiaoming' }, action) => {
      const { type, payload } = action;
      switch (type) {
        case 'UPDATE_USER_NAME':
          return { ...state, name: payload };
        default:
          return state;
      }
    },
  },
  { forwardRef: true }
);

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(LogChild)
);
