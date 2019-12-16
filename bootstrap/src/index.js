'use strict';
import * as singleSpa from 'single-spa';
import { registerApp } from './Register';

const SystemJS = window.System;

async function bootstrap() {
  // console.log('singleSpa.start()1');
  const projects = await SystemJS.import(`/project.config.js`)
    .then(m => m.default || m)
    .then(m => m.projects || []);

  projects.forEach(item => {
    // console.log('projects-item', item);
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
  // console.log('singleSpa', singleSpa);
  // window.addEventListener('single-spa:before-routing-event', evt => {
  //   const originalEvent = evt.detail;
  //   console.log('single-spa:before-routing-event', originalEvent);
  // });
  // window.addEventListener('single-spa:routing-event', evt => {
  //   console.log('single-spa:routing-event', evt);
  // });
  // window.addEventListener('single-spa:app-change', evt => {
  //   console.log('single-spa:app-change', evt);
  // });
}

bootstrap();
