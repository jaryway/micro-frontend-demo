'use strict';
// import '../libs/es6-promise.auto.min'
import '../lib/system';
import * as singleSpa from 'single-spa';
import { registerApp } from './Register';

async function bootstrap() {
  // 注册
  singleSpa.registerApplication(
    'core', // Name of this single-spa application
    () => import('../root.app'), // Our loading function
    () => true // Our activity function
  );

  let projectConfig = await window.System.import('/project.config.js').then(m => {
    console.log(m);
    return m;
  });
  projectConfig.projects.forEach(element => {
      
    registerApp({
      name: element.name,
      main: element.main,
      url: element.prefix,
      store: element.store,
      base: element.base,
      path: element.path,
    });
  });

  singleSpa.start();
}

bootstrap();
