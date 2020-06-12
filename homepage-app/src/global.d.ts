/// <reference path="./react-app-env.d.ts" />
/// <reference path='../src/api/index.fly.d.ts' />

interface ICONFIG {
  LOGIN_PAGE: string;
  TEST?: any;
  API_BASE_URL: string;
}
interface Window {
  CONFIG: ICONFIG;
  _store?: any;
}

declare let CONFIG: ICONFIG;
declare var window: Window;
// declare var API_BASE_URL: string;

declare module 'react-redux';
declare module 'hsp-utils';
declare module 'api';
declare module 'single-spa-react';
declare module 'flyio/dist/npm/fly';
declare module 'js-base64';
declare module 'crypto-js/md5';
