'use strict';

import * as singleSpa from 'single-spa';
import { registerApp } from './Register';
import * as store from '../Store';
import { GlobalEventDistributor } from './GlobalEventDistributor';
const globalEventDistributor = new GlobalEventDistributor();

export default async function bootstrap() {
  console.log('bootstrap', store, globalEventDistributor);
  // 注册
  const customProps = { store, globalEventDistributor };
  // 注册
  singleSpa.registerApplication(
    'core', // Name of this single-spa application
    () => import('../index.boot'), // Our loading function
    () => true, // Our activity function
    customProps
  );

  let projectConfig = await window.System.import('/project.config.json').then(m => {
    console.log(m);
    return m.default || m;
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

// bootstrap();
