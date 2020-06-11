import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
// import * as serviceWorker from './serviceWorker';
import RootComponent from "./root.component";
import { storeInstance, history } from "./Store";

console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx", process.env.MICRO);

if (process.env.NODE_ENV === "development" && !process.env.MICRO) {
  // 开发环境直接渲染
  ReactDOM.render(
    <RootComponent
      history={history}
      store={storeInstance}
      globalEventDistributor={storeInstance}
    />,
    document.getElementById("root")
  );
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (props) => {
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
  let el = document.getElementById("sub2-app-page");
  if (!el) {
    el = document.createElement("div");
    el.id = "sub2-app-page";
  }

  let timer = 1;

  const callback = () => {
    if (document.querySelector("#subapp")) {
      document.querySelector("#subapp").appendChild(el);
      clearInterval(timer);
      timer = null;
    }
  };

  // 进来先执行一次查找，如果找到直接mount，否则轮询一下
  callback();

  timer && (timer = setInterval(callback, 100));

  return el;
}

export const bootstrap = [reactLifecycles.bootstrap];
export const mount = [reactLifecycles.mount];
export const unmount = [reactLifecycles.unmount];

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
