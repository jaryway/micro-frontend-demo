import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Router, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { dynamic } from 'hsp-utils';
import Authorized from './utils/Authorized';

const BasicLayout = dynamic(() => import(`./App`));
// import BasicLayout from './App';
const { AuthorizedRoute } = Authorized;

function RootComponent({ store, history, globalEventDistributor }) {
  const [state] = useState({ store, globalEventDistributor, history });

  useEffect(() => {
    console.log('sub1-app.history.useEffect');

    const unlisten = state.history.listen((location, action) => {
      console.log('sub1-app.history.listen', history);
      if (action === 'PUSH') {
        globalEventDistributor.dispatch({
          type: 'to',
          path: location.pathname,
          owner: 'sub1-app',
        });
        const globalState = store.getState();
        console.log('history.listen-sub1-app ', globalState);
      }
    });
    return () => {
      console.log('sub1-app.history.unlisten');
      unlisten();
    };
  }, []);

  const customProps = { globalEventDistributor: state.globalEventDistributor };
  // console.log('sub1-app-store010000');
  return (
    <Provider store={state.store}>
      <LocaleProvider locale={zhCN}>
        <Router history={history}>
          <Switch>
            <AuthorizedRoute
              path='/'
              render={props => <BasicLayout {...customProps} {...props} />}
            />
          </Switch>
        </Router>
      </LocaleProvider>
    </Provider>
  );
}

export default RootComponent;
