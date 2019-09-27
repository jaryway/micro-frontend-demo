import './App.css';
import React, { forwardRef, Component } from 'react';
import { Route, Link } from 'react-router-dom';
// import React, { Component } from 'react';
// import ReactDOM, { render } from 'react-dom';

import { connect } from 'react-redux';
import { Button } from 'antd';
import Loadable from 'react-loadable';
import { dynamic } from 'hsp-utils';
import injectReducer from './utils/injectReducer';
import About from './About';
// const About = forwardRef(ref => <IAbout ref={ref} />);
const ref = React.createRef();
// const About = Loadable({
//   loader: () => import('./About'),
//   loading: () => <div></div>,
// });

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
          console.log('454545-render', ref);
          updateUserName(
            Math.random()
              .toString(16)
              .substring(2)
          );
        }}
      >
        ChangeName
      </Button>
      <Parent>sdfasdfasdfa</Parent>

      <Route exact path='/' component={Home} />
      <Route path='/user' component={User} />
      <Route
        path='/about'
        render={() => {
          return <About forwardRef={ref} ref={ref}></About>;
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

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

const ref1 = React.createRef();

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <WrappedComponent ref={forwardedRef} {...rest} />;
    }
  }

  return React.forwardRef((props, ref) => {
    return <LogProps forwardedRef={ref} {...props} />;
  });
}

class Child extends Component {
  constructor() {
    super();
  }
  render() {
    return <div>{this.props.txt}jsdhfdjsjsjsjsj </div>;
  }
}

const LogChild = logProps(Child);

class Parent extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    console.log(ref1); //获取Child组件
  }
  render() {
    return <LogChild ref={ref1} txt='parent props txt' />;
  }
}
