// 这里统一引入antd 样式，其他子项目微前端打包时，不在打包antd 样式
/// <reference path="./react-app-env.d.ts" />
import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './root.component';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
  document.getElementById('root')
);
