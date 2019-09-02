import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import * as serviceWorker from './serviceWorker';
import RootComponent from './root.component';
// ReactDOM.render(<App />, document.getElementById('root'));

// if (process.env.NODE_ENV === "development" && !MICRO) {
//   // 开发环境这样处理
//   ReactDOM.render(
//     <RootComponent
//     //   history={history}
//     //   store={storeInstance}
//     //   globalEventDistributor={storeInstance}
//     />,
//     document.getElementById("root")
//   );
// }

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: spa => {
    return <RootComponent />;
  },
  // 可能会有加载顺序的问题
  domElementGetter,
});

function domElementGetter() {
  let el = document.getElementById('sub-module-page');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sub-module-page';
  }

  let timer = 1;

  const callback = () => {
    if (document.querySelector('.ant-layout-content #sub-module')) {
      document.querySelector('.ant-layout-content #sub-module').appendChild(el);
      clearInterval(timer);
      timer = null;
    }
  };

  // 进来先执行一次查找，如果找到直接mount，否则轮询一下

  callback();

  timer && (timer = setInterval(callback, 100));

  return el;

  // return document.querySelector('.ant-layout-content #sub-module');
  // return document.getElementById('root');
}

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
