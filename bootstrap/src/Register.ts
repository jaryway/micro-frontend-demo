import * as singleSpa from 'single-spa';
import { GlobalEventDistributor } from './GlobalEventDistributor';
const globalEventDistributor = new GlobalEventDistributor();
const SystemJS = window.System;

export interface AppConfigProps {
  name: string;
  // main: { css: string[]; js: string[] };
  entrypoints: { main: string[]; store?: string[] };
  prefix: string | string[];
  store: string;
  base: boolean;
}
interface StoreModuleProps {
  storeInstance?: any;
  history?: any;
}

interface CustomProps {
  store?: StoreModuleProps;
  globalEventDistributor: GlobalEventDistributor;
}

export async function registerSubApps(callback?: () => void) {
  getAppConfigs()
    .then(async (configs: AppConfigProps[]) => {
      return Promise.all(configs.map((config) => registerApp(config)));
    })
    .then(() => {
      callback && callback();
    });

  singleSpa.start();
}

// eslint-disable-next-line no-unused-vars
export async function registerApp(
  app: AppConfigProps,
  // globalEventDistributor: any,
  // _history: any,
  _appName?: string
) {
  // 导入store模块
  let storeModule: StoreModuleProps = { storeInstance: undefined, history: undefined };
  let customProps: CustomProps = { globalEventDistributor };
  // console.log('register', app);
  // 尝试导入store
  try {
    storeModule = app.entrypoints.store
      ? await loadResources(app.entrypoints.store).then((m: any) => ({
          ...storeModule,
          ...m,
        }))
      : storeModule;
  } catch (e) {
    console.log(`Could not load store of app ${app.name}.`, e);
    // 如果失败则不注册该模块
    return;
  }

  // console.log('history', storeModule.history);

  // 注册应用于事件派发器
  if (storeModule.storeInstance && globalEventDistributor) {
    //取出 redux storeInstance
    customProps.store = { storeInstance: storeModule.storeInstance };
    // 注册到全局
    globalEventDistributor.registerStore(storeModule.storeInstance);
  }

  // 准备自定义的props,传入每一个单独工程项目
  customProps = { store: { ...storeModule }, globalEventDistributor };

  singleSpa.registerApplication(
    app.name,
    async () => {
      globalEventDistributor &&
        globalEventDistributor.dispatch({ type: 'SUB_APP_LOADING', payload: true });
      // console.log(`${app.name} is loading.`, app.entrypoints.main);
      const res = await loadResources(app.entrypoints.main).then((resp) => {
        globalEventDistributor &&
          globalEventDistributor.dispatch({ type: 'SUB_APP_LOADING', payload: false });
        // console.log(`${app.name} has been loaded.`);
        return resp;
      });
      return res;
    },
    app && app.name === 'base' ? () => true : checkActive(app.prefix),
    customProps
  );

  // console.log('register-end', app);
}

//
export function checkActive(prefix: string | string[], mode: 'Browser' | 'Hash' = 'Browser') {
  return (location: any) => {
    // console.log('checkActive', location);
    //如果该应用 有多个需要匹配的路径
    const pathname = mode === 'Browser' ? location.pathname : location.hash.slice(1);

    if (typeof prefix !== 'string') return prefix.some((m) => pathname.startsWith(m));
    // 普通情况
    return pathname.startsWith(prefix);
  };
}

function getAppConfigs() {
  if (window.CONFIG.REGISTER_TYPE === 'split') {
    const { deployApps } = window;
    if (!deployApps || !deployApps.length) {
      throw new Error('项目配置错误：缺乏 deployApps 配置');
    }

    // 过滤掉加载出错的 app
    return Promise.all(
      deployApps.map((m) =>
        window.System.import(`/${m}/project.json`)
          .then((n: any) => n.default)
          .catch(() => undefined)
      )
    ).then((resp) => resp.filter(Boolean));
  }

  const version = Math.ceil(new Date().getTime() / 1000 / 1); // 1 分钟更新一次
  return window.System.import(`/project.config.js?v=${version}`)
    .then((m: any) => (m.default || m).projects)
    .catch(() => []);
}

/**
 * 加载资源文件
 * @param resources
 * @param appName
 */
async function loadResources(resources: string[], appName?: string) {
  let starter: any;

  for (let i = 0; i < resources.length; i++) {
    // console.log('singleSpa-loadResources', resources[i]);

    if (!resources[i].endsWith('.hot-update.js')) {
      // eslint-disable-next-line no-await-in-loop
      starter = await window.System.import(`${appName ? `/${appName}` : ''}${resources[i]}`);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await window.System.import(`${appName ? `/${appName}` : ''}${resources[i]}`);
    }
    // console.log('singleSpa-loadResources4', starter);
  }

  // console.log('singleSpa-loadResources', starter);
  return Promise.resolve(starter);
}

// // eslint-disable-next-line no-unused-vars
// export async function registerApp(app: AppConfigProps, _appName?: string) {
//   // 导入store模块
//   let storeModule: StoreModuleProps = { storeInstance: undefined, history: undefined };
//   const customProps: CustomProps = { globalEventDistributor: globalEventDistributor };

//   // 尝试导入store
//   try {
//     storeModule = app.entrypoints.store
//       ? await loadResources(app.entrypoints.store).then((m: any) => ({
//           ...storeModule,
//           ...m,
//         }))
//       : storeModule;
//   } catch (e) {
//     console.log(`Could not load store of app ${app.name}.`, e);
//     // 如果失败则不注册该模块
//     return;
//   }
//   // 注册应用于事件派发器
//   if (storeModule.storeInstance && globalEventDistributor) {
//     //取出 redux storeInstance
//     customProps.store = storeModule.storeInstance;

//     // 注册到全局
//     globalEventDistributor.registerStore(storeModule.storeInstance);
//   }
//   // console.log('register', app);
//   // 准备自定义的props,传入每一个单独工程项目
//   customProps.store = storeModule;

//   singleSpa.registerApplication(
//     app.name,
//     async () => {
//       // let component;
//       // for (let i = 0; i < app.entrypoints.main.length; i++) {
//       //   const entrypoint = app.entrypoints.main[i];
//       //   console.log(`register-${app.name}-js:${entrypoint}`);
//       //   component = await SystemJS.import(`/${appName}${entrypoint}`).catch((ex: any) =>
//       //     console.error(ex)
//       //   );
//       // }
//       return await loadResources(app.entrypoints.main);

//       // for (let i = 0; i < app.main.css.length; i++) {
//       //   console.log(`register-${app.name}-css:${app.main.css[i]}`);
//       //   await SystemJS.import(app.main.css[i]).then((m: any) => {
//       //     console.log(`register-sss-${app.name}-css:`, m);
//       //     return m;
//       //   });
//       // }

//       // // 依次加载入口文件（runtime，main），返回最后一个
//       // for (let i = 0; i < app.main.js.length; i++) {
//       //   console.log(`register-${app.name}-js:${app.main.js[i]}`);
//       //   component = await SystemJS.import(app.main.js[i]).catch((ex: any) => console.error(ex));
//       // }
//       // console.log(component, 'component');
//       // return component;
//     },
//     app && app.name === 'base' ? () => true : hashPrefix(app.prefix),
//     customProps
//   );
// }

// function isArray(o: any) {
//   return Object.prototype.toString.call(o) == '[object Array]';
// }
