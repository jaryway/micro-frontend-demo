'use strict';
import * as singleSpa from 'single-spa';
// eslint-disable-next-line no-unused-vars
import { registerSubApps, registerApp, AppConfigProps } from './Register';

// const SystemJS = window.System;
// let baseAppPromise: any;

// async function splitAppBoot() {
//   if (!window.deployApps || !window.deployApps.length) {
//     throw new Error('项目配置错误：缺乏 deployApps 配置');
//   }

//   const sortedDeployApps = window.deployApps.sort((a: string) => (a === 'base-app' ? -1 : 0));

//   if (sortedDeployApps[0] !== 'base-app') {
//     throw new Error('项目配置错误：缺乏 base-app 配置');
//   }

//   sortedDeployApps.forEach(async (m, i) => {
//     await SystemJS.import(`/${m}/project.json`)
//       .then((m: any) => m.default)
//       .then((appConfig: AppConfigProps) => {
//         if (i === 0) {
//           baseAppPromise = registerApp(appConfig, m).then(() =>
//             console.log('register-base-app ok')
//           );
//         } else {
//           baseAppPromise.then(() => {
//             console.log(`register-${appConfig.name}`);
//             registerApp(appConfig, m);
//           });
//         }
//       })
//       .catch(() => ({}));
//   });
// }

// async function mergeAppBoot() {
//   const version = Math.ceil(new Date().getTime() / 1000 / 1); // 1 分钟更新一次
//   const projects: AppConfigProps[] = await SystemJS.import(`/project.config.js?v=${version}`)
//     .then((m: any) => m.default || m)
//     .then((m: any) => m.projects || []);

//   if (!projects.some((m) => m.name === 'base')) {
//     throw new Error('项目配置错误：缺乏 base app');
//   }

//   projects
//     .sort((a) => (a.name === 'base' ? -1 : 0)) // 优先加载 base-app，因为子站点要依赖由于 base-app
//     .forEach((appConfig: AppConfigProps, i: number) => {
//       console.log('register-App', appConfig);
//       if (i === 0) {
//         baseAppPromise = registerApp(appConfig).then(() => console.log('register-base-app ok'));
//       } else {
//         baseAppPromise.then(() => {
//           console.log(`register-${appConfig.name}`);
//           registerApp(appConfig);
//         });
//       }
//     });
// }

async function bootstrap() {
  // console.log('singleSpa', singleSpa);

  // 每次刷新页面都加载新的 project.config 文件
  // const version = Math.ceil(new Date().getTime() / 1000 / 1); // 1 分钟更新一次
  registerSubApps();
  // if (window.appRegisterType === 'split') {
  //   // 每个 app 独立加载 app 配置文件的方式
  //   await splitAppBoot();
  // } else {
  //   // 将所有 app 配置文件合并成一个文件的方式
  //   await mergeAppBoot();
  // }

  // singleSpa.setMountMaxTime(3000, true);
  singleSpa.addErrorHandler((err: any) => {
    console.log('singleSpa.addErrorHandler', err);
    if (singleSpa.getAppStatus(err.appOrParcelName) === singleSpa.LOAD_ERROR) {
      // SystemJS.delete(SystemJS.resolve(err.appOrParcelName));
    }
  });
  // // 切换子系统的时候给body加上对应子系统的 class namespace
  // window.addEventListener('single-spa:app-change', () => {
  //   // const app = getMountedApps().pop();
  //   console.log('single-spa:app-change', singleSpa.getMountedApps());
  //   // const isApp = /^app-\w+$/.test(app);
  //   // if (isApp) document.body.className = app;
  // });

  singleSpa.start();
}

bootstrap();
