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

function ensureMount(cb) {
  let timer = 1;
  console.log('sub1-app.mount.ensureMount');
  const callback = () => {
    if (document.querySelector('#maincontent')) {
      console.log('sub1-app.mount.ensureMount.find.subapp');
      clearInterval(timer);
      timer = null;
      cb();
    }
  };

  // 进来先执行一次查找，如果找到直接mount，否则轮询一下
  callback();

  timer && (timer = setInterval(callback, 1));
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  // rootComponent: props => {
  //   console.log('sub1-app.rootComponent', props);
  //   return (
  //     <RootComponent
  //       history={props.store.history}
  //       store={props.store.storeInstance}
  //       globalEventDistributor={props.globalEventDistributor}
  //     />
  //   );
  // },
  loadRootComponent: () => {
    console.log('sub1-app.mount.loadRootComponent.initial');
    return new Promise(resolve => {
      ensureMount(() =>
        resolve(props => {
          console.log('sub1-app.mount.loadRootComponent.appendChild', props);
          return (
            <RootComponent
              history={props.store.history}
              store={props.store.storeInstance}
              globalEventDistributor={props.globalEventDistributor}
            />
          );
        })
      );
    });
  },
  // 可能会有加载顺序的问题
  domElementGetter,
});

function domElementGetter() {
  // Make sure there is a div for us to render into
  let el = document.getElementById('sub1-app');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sub1-app';
    document.getElementById('maincontent').appendChild(el);
  }

  return el;
}

// function domElementGetter() {
//   console.log('sub1-app.mount.domElementGetter');
//   let el = document.getElementById('sub-app-page');
//   if (!el) {
//     el = document.createElement('div');
//     el.id = 'sub-app-page';
//   }

//   ensureMount(() => {
//     document.querySelector('#subapp').appendChild(el);
//     console.log('sub1-app.mount.ensureMount.append2document');
//   });

//   return el;
// }

export const bootstrap = [reactLifecycles.bootstrap];
// export const mount = [reactLifecycles.mount];
export async function mount(props) {
  const { globalEventDistributor } = props;
  const { base: baseState } = globalEventDistributor.getState();
  const { account } = baseState;
  console.log('sub1-app.mount.initital', baseState);
  /* Note：
   * 这里要确保 mount 的时候 account 信息已经加载好
   */

  // 如果 base 的用户信息已经加载好，直接 mount app；
  // 否则 dispatch 一下，会在 currentEmp 加载好后执行mount
  const baseAppIsOk = account && account.currentEmpLoading === false;

  if (baseAppIsOk) {
    console.log('sub1-app.mount.mount_app1', baseState);
    return reactLifecycles.mount(props);

    // return new Promise(resolve => {
    //   console.log('sub1-app.mount.waitting_doc', props);
    //   setTimeout(() => {
    //     resolve(reactLifecycles.mount(props));
    //   }, 3000);
    //   // ensureMount(() => {
    //   //   resolve(reactLifecycles.mount(props));
    //   // });
    // });
  }

  return new Promise(resolve => {
    console.log('sub1-app.mount.register_app', baseState);

    globalEventDistributor.dispatch({
      type: 'REGISTER_APP',
      payload: {
        mount: () => {
          console.log('sub1-app.mount.mount_app2', baseState);
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
