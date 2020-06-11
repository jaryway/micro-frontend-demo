import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { Router, Switch } from "react-router-dom";
import Authorized from "./utils/Authorized";
import BasicLayout from "./App";
// import Store from './Store';
// import logo from './logo.svg';
import "./App.css";

const { AuthorizedRoute } = Authorized;

function RootComponent({ store, history, globalEventDistributor, ...rest }) {
  // const [state, setState] = useState({
  //   store,
  //   globalEventDistributor,
  //   history,
  // });

  console.log("base-app.RootComponent", history);

  useEffect(() => {
    console.log("base-app.RootComponent-listen", history);
    const unlisten = history.listen((location, action) => {
      console.log("base-app.RootComponent-listen1", location, action, history);
      // console.log("base-app.history.listen", location, action);
      if (action === "PUSH") {
        // globalEventDistributor.dispatch({
        //   type: "to",
        //   path: location.pathname,
        //   owner: "base",
        // });
      }
    });
    return () => {
      console.log("base-app.RootComponent-unlisten", history);
      unlisten();
    };
  }, []);

  const customProps = { globalEventDistributor: globalEventDistributor };
  // console.log('base-app-store', store.getState());
  return (
    <Provider store={store}>
      {/* <BasicLayout {...customProps} /> */}
      <Router history={history}>
        <Switch>
          <AuthorizedRoute
            path="/"
            render={(props) => <BasicLayout {...customProps} {...props} />}
          />
        </Switch>
      </Router>
    </Provider>
  );
}

export default RootComponent;
