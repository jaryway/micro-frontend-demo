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
  console.log('sub1-app.domElementGetter');
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
  const { base: baseState } = globalEventDistributor.getState();
  const { account } = baseState;
  console.log('sub1-app.mount', baseState);
  /* Note：
   * 这里要确保 mount 的时候 account 信息已经加载好
   */

  // 如果 base 的用户信息已经加载好，直接 mount app；
  // 否则 dispatch 一下，会在 currentEmp 加载好后执行mount
  const baseAppIsOk = account && account.currentEmpLoading === false;

  if (baseAppIsOk) return reactLifecycles.mount(props);

  return new Promise(resolve => {
    console.log('sub1-app.mount1', baseState);
    globalEventDistributor.dispatch({
      type: 'WILL_MOUNT',
      payload: {
        mount: () => {
          console.log('sub1-app.mount2', baseState);
          resolve(reactLifecycles.mount(props));
        },
      },
    });
  });
}
export const unmount = [reactLifecycles.unmount];

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
