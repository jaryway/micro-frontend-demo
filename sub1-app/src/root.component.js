import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { dynamic } from 'hsp-utils';
import Authorized from './utils/Authorized';
// import { history as browserHistory } from './Store';

const BasicLayout = dynamic(() => import(`./App`));
const { AuthorizedRoute } = Authorized;

// import { createBrowserHistory } from 'history';

// const browserHistory = createBrowserHistory();

function RootComponent({ store, history, globalEventDistributor }) {
  // const [state] = useState({ store, globalEventDistributor, history });
  console.log('sub1-app.RootComponent-listen1', history);
  useEffect(() => {
    // // console.log('sub1-app.history.useEffect');
    // const unlisten = state.history.listen((location, action) => {
    //   // console.log('sub1-app.history.listen', history);
    //   if (action === "PUSH") {
    //     globalEventDistributor.dispatch({
    //       type: "to",
    //       path: location.pathname,
    //       owner: "sub1-app",
    //     });
    //   }
    // });
    // return () => {
    //   // console.log("sub1-app.history.unlisten");
    //   unlisten();
    // };
  }, []);

  const customProps = { globalEventDistributor };

  return (
    <Provider store={store}>
      <LocaleProvider locale={zhCN}>
        <Router history={history}>
          <Switch>
            <AuthorizedRoute
              path='/'
              //
              render={() => {
                return (
                  <div>
                    <button
                      type='button'
                      onClick={() => {
                        history.push('/sub2-app/home');
                      }}
                    >
                      sub2-app
                    </button>
                    {'  '}
                    <button
                      type='button'
                      onClick={() => {
                        history.push('/workflow-app/todo/list');
                      }}
                    >
                      workflow
                    </button>
                  </div>
                );
              }}
              // render={(props) => <BasicLayout {...customProps} {...props} />}
            />
          </Switch>
        </Router>
      </LocaleProvider>
    </Provider>
  );
}

export default RootComponent;
