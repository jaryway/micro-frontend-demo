import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import * as serviceWorker from './serviceWorker';
import RootComponent from './root.component';
import { storeInstance, history } from './Store';
// import './index.less';

if (process.env.NODE_ENV === 'development') {
  // 开发环境这样处理
  // ReactDOM.render(
  //   <RootComponent
  //     history={history}
  //     store={storeInstance}
  //     globalEventDistributor={storeInstance}
  //   />,
  //   document.getElementById('root')
  // );
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: props => {
    console.log('singleSpaReact', props);
    return (
      <RootComponent
        history={props.store.history}
        store={props.store.storeInstance}
        globalEventDistributor={props.globalEventDistributor}
      />
    );
  },
  domElementGetter: () => document.getElementById('root'),
});

export const bootstrap = [reactLifecycles.bootstrap];
export const mount = [reactLifecycles.mount];
export const unmount = [reactLifecycles.unmount];

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
