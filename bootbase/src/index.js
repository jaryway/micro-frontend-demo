// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import RootComponent from './root.component';
import { storeInstance, history } from './Store';

if (process.env.NODE_ENV === 'development') {
  // 开发环境直接渲染
  ReactDOM.render(
    <RootComponent
      history={history}
      store={storeInstance}
      globalEventDistributor={storeInstance}
    />,
    document.getElementById('root')
  );
}

//创建生命周期实例
const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: props => {
    // console.log('singleSpaReact-rootComponent', props);
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

// 项目启动的钩子
export const bootstrap = [reactLifecycles.bootstrap];
// 项目启动后的钩子
export const mount = function(props) {
  console.log('base-app.mount');
  return reactLifecycles.mount(props);
};
// 项目卸载的钩子
export const unmount = [reactLifecycles.unmount];
