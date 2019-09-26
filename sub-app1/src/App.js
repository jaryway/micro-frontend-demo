import './App.css';
import React from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Button } from 'antd';
// import Loadable from 'react-loadable';
import injectReducer from './utils/injectReducer';
// import About from './About';

// const About = Loadable({
//   loader: () => import('./About'),
//   loading: () => <div></div>,
// });

// function Home() {
//   return (
//     <div>
//       <h2>Home</h2>
//     </div>
//   );
// }

// function SubApp() {
//   return (
//     <div id='subapp'>
//       <h2>SubApp</h2>
//     </div>
//   );
// }

function App({ name = '', updateUserName = () => {}, ...props }) {
  // console.log('props', name);
  return (
    <div className=''>
      SUB-APP
      <p>{name}</p>
      <button
        onClick={() => {
          updateUserName(
            Math.random()
              .toString(16)
              .substring(2)
          );
        }}
      >
        ChangeName
      </button>
    </div>
  );
}

const withReducer = injectReducer({
  key: 'app',
  reducer: (state = { name: 'xiaoming' }, action) => {
    const { type, payload } = action;
    switch (type) {
      case 'APP.UPDATE_NAME':
        return { ...state, name: payload };
      default:
        return state;
    }
  },
});
const mapStateToProps = state => {
  return state.app || {};
};
const mapDispatchToProps = dispatch => {
  return {
    updateUserName: value => dispatch({ type: 'APP.UPDATE_NAME', payload: value }),
  };
};

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
