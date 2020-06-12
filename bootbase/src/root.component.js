import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Router, Switch } from "react-router-dom";
import { UseAPIProvider } from "@umijs/use-request";
import { request4useRequest } from "api";

import Authorized from "./utils/Authorized";
import BasicLayout from "./App";
import { history, storeInstance as store } from "./Store";
import { GlobalEventDistributor } from "./utils/GlobalEventDistributor";

import SecurityLayout from "./layouts/SecurityLayout";

// import logo from './logo.svg';
import "./App.css";

const { AuthorizedRoute } = Authorized;
const globalEventDistributor = new GlobalEventDistributor();
globalEventDistributor.registerStore(store);

function RootComponent({ ...rest }) {
  console.log("base-app.RootComponent", history);

  useEffect(() => {
    console.log("base-app.RootComponent-listen", history);
    const unlisten = history.listen((location, action) => {
      console.log("base-app.RootComponent-listen1", location, action, history);
      // console.log("base-app.history.listen", location, action);
      if (action === "PUSH") {
        globalEventDistributor.dispatch({
          type: "to",
          path: location.pathname,
          owner: "base",
        });
      }
    });
    return () => {
      console.log("base-app.RootComponent-unlisten", history);
      unlisten();
    };
  }, []);

  const customProps = { globalEventDistributor };
  // console.log('base-app-store', store.getState());
  return (
    <Provider store={store}>
      <UseAPIProvider value={{ requestMethod: request4useRequest }}>
        <Router history={history}>
          <Switch>
            <AuthorizedRoute
              path="/"
              render={(props) => (
                <SecurityLayout {...customProps} {...props}>
                  <BasicLayout {...customProps} {...props} />
                </SecurityLayout>
              )}
            />
          </Switch>
        </Router>
      </UseAPIProvider>
    </Provider>
  );
}

export default RootComponent;
