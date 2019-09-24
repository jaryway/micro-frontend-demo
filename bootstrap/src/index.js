'use strict';
import * as singleSpa from 'single-spa';
import { registerApp } from './Register';

const SystemJS = window.System;

async function bootstrap() {
  // console.log('singleSpa.start()1');
  const projects = await SystemJS.import('/project.config.json')
    .then(m => m.default || m)
    .then(m => m.projects || []);

  projects.forEach(item => {
    console.log('projects-item', item);
    registerApp({
      name: item.name,
      main: item.main,
      url: item.prefix,
      store: item.store,
      base: item.base,
      path: item.path,
    });
  });
  // console.log('singleSpa.start()2');
  singleSpa.start();
}

bootstrap();
