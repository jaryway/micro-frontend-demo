import '/';
// import 'systemjs/dist/extras/amd';
// import '../libs/es6-promise.auto.min'
// import '../lib/system';
import * as singleSpa from 'single-spa';
import * as store from '../Store';
import { GlobalEventDistributor } from './GlobalEventDistributor';
const globalEventDistributor = new GlobalEventDistributor();
const SystemJS = window.System;

// hash 模式
export function hashPrefix(app) {
  return function(location) {
    let isShow = false;
    //如果该应用 有多个需要匹配的路劲
    if (isArray(app.path)) {
      app.path.forEach(path => {
        if (location.hash.startsWith(`#${path}`)) {
          isShow = true;
        }
      });
    }
    // 普通情况
    else if (location.hash.startsWith(`#${app.path || app.url}`)) {
      isShow = true;
    }
    return isShow;
  };
}

// 普通路径模式
export function pathPrefix(app) {
  return function(location) {
    let isShow = false;
    //如果该应用 有多个需要匹配的路劲
    if (isArray(app.path)) {
      app.path.forEach(path => {
        if (location.pathname.indexOf(`${path}`) === 0) {
          isShow = true;
        }
      });
    }
    // 普通情况
    else if (location.pathname.indexOf(`${app.path || app.url}`) === 0) {
      isShow = true;
    }
    return isShow;
  };
}
export async function registerApp(params) {
  // 导入store模块
  let storeModule = {},
    customProps = { store, globalEventDistributor: globalEventDistributor };

  // 尝试导入store
  try {
    storeModule = params.store ? await window.System.import(params.store) : { storeInstance: null };
  } catch (e) {
    console.log(`Could not load store of app ${params.name}.`, e);
    //如果失败则不注册该模块
    return;
  }
  // 注册应用于事件派发器
  if (storeModule.storeInstance && globalEventDistributor) {
    //取出 redux storeInstance
    customProps.store = storeModule.storeInstance;

    // 注册到全局
    globalEventDistributor.registerStore(storeModule.storeInstance);
  }

  //准备自定义的props,传入每一个单独工程项目
  customProps = { store, globalEventDistributor };

  // window.System.import(params.main).then(m => {
  //   console.log('module', m);
  //   return m;
  // });

  console.log('pathPrefix(params)', hashPrefix(params));

  singleSpa.registerApplication(
    params.name,
    async () => {
      let component;

      for (let i = 0; i < params.main.css.length; i++) {
        await SystemJS.import(params.main.css[i])
          .then(c => console.log(c))
          .catch(er => console.log(er));
      }

      // 依次加载入口文件（runtime，main），返回最后一个
      for (let i = 0; i < params.main.js.length; i++) {
        component = await SystemJS.import(params.main.js[i])
          .then(m => {
            console.log('m', params.main.js[i], m);
            return m;
          })
          .catch(er => console.log(er, params.main.js[i]));
      }
      console.log(component, 'component');
      return component;
    },
    hashPrefix(params)
  );

  // singleSpa.registerApplication(
  //   params.name,
  //   () =>
  //     window.System.import(params.main).then(m => {
  //       console.log('modulezzzzzzzzzzzzzzzzzz', params.main);
  //       return m;
  //     }),
  //   params.base ? () => true : hashPrefix(params),
  //   customProps
  // );
}

function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
