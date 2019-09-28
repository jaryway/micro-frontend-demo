import './App.css';
import React, { forwardRef, Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Loadable from 'react-loadable';
import { dynamic } from 'hsp-utils';
import injectReducer from './utils/injectReducer';
// import About from './About';
// import Logger from './Logger';
// const About = forwardRef((props, ref) => <About1 {...props} ref={ref} />);

// const ref = React.createRef();
const ref1 = React.createRef();
const aboutRef = React.createRef();

const About = Loadable({
  // loader: () => import('./About'),
  loader: async () => {
    const { default: LoadableComponent } = await import('./About');
    return ({ forwardRef, ...props }) => <LoadableComponent {...props} ref={forwardRef} />;
  },

  loading: () => <div></div>,
  // render: (loaded, props) => {
  //   let Component = loaded.default;

  //   const Forwarded = forwardRef((rest, ref) => <Component {...rest} rf={ref} />);

  //   return <Forwarded {...props} />;
  // },
});

// const About = dynamic(() => import('./About'));
const User = dynamic(() => import('./User'));

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function SubApp() {
  return (
    <div id='subapp'>
      <h2>SubApp</h2>
    </div>
  );
}

function App({ name = '', updateUserName = () => {} }) {
  // console.log('props', name);
  return (
    <div className=''>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/user'>User</Link>
        </li>
        <li>
          <Link to='/sub1-app'>sub-app1</Link>
        </li>
      </ul>
      <p>{name}</p>
      <Button
        onClick={() => {
          console.log('ChangeName-click', ref1, aboutRef);
          updateUserName(
            Math.random()
              .toString(16)
              .substring(2)
          );
        }}
      >
        ChangeName
      </Button>
      {/* <Parent>sdfasdfasdfa</Parent> */}

      <Route exact path='/' component={Home} />
      <Route path='/user' component={User} />
      <Route
        path='/about'
        render={() => {
          return <About forwardRef={ref1} ref={aboutRef} name={'dddd'}></About>;
        }}
      />
      <Route path='/sub1-app' component={SubApp} />
    </div>
  );
}

const withReducer = injectReducer({
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
});
const mapStateToProps = state => {
  return state.app || {};
};
const mapDispatchToProps = dispatch => {
  return {
    updateUserName: value => dispatch({ type: 'UPDATE_USER_NAME', payload: value }),
  };
};

// export default App;

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

// // const WithReducerComponent = withReducer({})(Connect);

// function Parent(props) {
//   return <WithReducerComponent {...props} ref={ref1} txt='parent props txt' />;
// }
