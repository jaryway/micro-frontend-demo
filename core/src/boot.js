import * as singleSpa from 'single-spa';
import * as serviceWorker from './serviceWorker';

import { GlobalEventDistributor } from './GlobalEventDistributor' 
const globalEventDistributor = new GlobalEventDistributor();


const SystemJS = window.System;

async function bootstrap() {
  // console.log('bootstrap', SystemJS, window.System);

  const customProps = {};
  // 注册
  singleSpa.registerApplication(
    'core', // Name of this single-spa application
    () => import('./root.component'), // Our loading function
    () => true, // Our activity function
    customProps
  );

  let projectConfig = await SystemJS.import('/project.config.json').then(m => m.default || m);
  console.log('projectConfig', projectConfig);

  projectConfig.projects.forEach(element => {
    singleSpa.registerApplication(
      element.name,
      async () => {
        let component;

        for (let i = 0; i < element.main.css.length; i++) {
          await SystemJS.import(element.main.css[i])
            .then(c => console.log(c))
            .catch(er => console.log(er));
        }

        // 依次加载入口文件（runtime，main），返回最后一个
        for (let i = 0; i < element.main.js.length; i++) {
          component = await SystemJS.import(element.main.js[i])
            .then(m => {
              console.log('m', element.main.js[i], m);
              return m;
            })
            .catch(er => console.log(er));
        }
        console.log(component, 'component');
        return component;
      },
      () => window.location.hash.startsWith(`#${element.prefix}`)
    );
  });

  singleSpa.start();
}

bootstrap();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
