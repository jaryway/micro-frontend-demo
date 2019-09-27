import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import Authorized from './utils/Authorized';
import BasicLayout from './App';
// import Store from './Store';
// import logo from './logo.svg';
import './App.css';

const { AuthorizedRoute } = Authorized;

function RootComponent({ store, history, globalEventDistributor, ...rest }) {
  const [state, setState] = useState({ store, globalEventDistributor });

  useEffect(() => {
    history.listen((location, action) => {
      if (action === 'PUSH') {
        globalEventDistributor.dispatch({
          type: 'to',
          path: location.pathname,
          owner: 'base',
        });
        const globalState = store.getState();
        console.log('history.listen', globalState);
      }
    });
  }, []);

  const customProps = { globalEventDistributor: state.globalEventDistributor };
  console.log('base-app-store', store.getState());
  return (
    <Provider store={state.store}>
      {/* <BasicLayout {...customProps} /> */}
      <Router history={history}>
        <Switch>
          <AuthorizedRoute path='/' render={props => <BasicLayout {...customProps} {...props} />} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default RootComponent;
