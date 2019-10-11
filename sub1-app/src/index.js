import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
// import * as serviceWorker from './serviceWorker';
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

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: props => {
    return (
      <RootComponent
        history={props.store.history}
        store={props.store.storeInstance}
        globalEventDistributor={props.globalEventDistributor}
      />
    );
  },
  // 可能会有加载顺序的问题
  domElementGetter,
});

function domElementGetter() {
  console.log('domElementGetter');
  let el = document.getElementById('sub-app-page');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sub-app-page';
  }

  let timer = 1;

  const callback = () => {
    if (document.querySelector('#subapp')) {
      document.querySelector('#subapp').appendChild(el);
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
// export const mount = [reactLifecycles.mount];
export async function mount(props) {
  const { globalEventDistributor } = props;
  globalEventDistributor.getState();
  console.log('mount', props);
  // return new Promise(res)

  return reactLifecycles.mount(props);
}
export const unmount = [reactLifecycles.unmount];

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
