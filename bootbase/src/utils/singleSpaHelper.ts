// const System = window.System;

import * as singleSpa from 'single-spa';
import { GlobalEventDistributor } from './GlobalEventDistributor';

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

export async function registerSubApps(
  globalEventDistributor: GlobalEventDistributor,
  callback?: () => void
) {
  getAppConfigs()
    .then(async (configs: AppConfigProps[]) => {
      return Promise.all(configs.map((config) => registerApp(config, globalEventDistributor)));
    })
    .then(() => {
      callback && callback();
    });

  // window.System.import(`/project.config.js?v=${version}`);
  // const { deployApps } = window;
  // if (!deployApps || !deployApps.length) {
  //   throw new Error('项目配置错误：缺乏 deployApps 配置');
  // }
  // Promise.all(
  //   deployApps.map((m) =>
  //     window.System.import(`/${m}/project.json`)
  //       .then((n: any) => n.default)
  //       .then(async (appConfig: AppConfigProps) => {
  //         // console.log('registerSubApps-load');
  //         await registerApp(appConfig, globalEventDistributor);
  //       })
  //       .catch(() => ({}))
  //   )
  // ).then(() => {
  //   callback && callback();
  // });

  singleSpa.start();
}

// eslint-disable-next-line no-unused-vars
export async function registerApp(
  app: AppConfigProps,
  globalEventDistributor: any,
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

  console.log('historyhistoryhistory', app.name, storeModule.history);

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
    checkActive(app.prefix),
    customProps
  );

  // console.log('register-end', app);
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
//
export function checkActive(prefix: string | string[], mode: 'Browser' | 'Hash' = 'Browser') {
  return (location: any) => {
    // console.log('checkActive', location);
    //如果该应用 有多个需要匹配的路径
    const pathname = mode === 'Browser' ? location.pathname : location.hash.slice(1);
    // console.log(
    //   'checkActive',
    //   prefix,
    //   typeof prefix !== 'string'
    //     ? prefix.some((m) => pathname.startsWith(m))
    //     : pathname.startsWith(prefix),
    //   window.location.pathname
    // );
    if (typeof prefix !== 'string') return prefix.some((m) => pathname.startsWith(m));
    // 普通情况
    return pathname.startsWith(prefix);
  };
}
