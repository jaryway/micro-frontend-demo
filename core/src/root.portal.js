import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Portal from './Portal';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Portal,
  domElementGetter,
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];

function domElementGetter() {
  // return document.getElementById('sub-module');

  let el = document.getElementById('sub-module-page');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sub-module-page';
  }
  let timer = null;
  timer = setInterval(() => {
    if (document.querySelector('.ant-layout-content #sub-module')) {
      document.querySelector('.ant-layout-content #sub-module').appendChild(el);
      clearInterval(timer);
    }
  }, 100);

  return el;
}
