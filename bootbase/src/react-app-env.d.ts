/* eslint-disable no-unused-vars */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MICRO: 'true' | 'false' | undefined;
    readonly PUBLIC_URL: string;
  }
}
interface ICONFIG {
  REGISTER_TYPE: 'split' | 'merge';
  LOGIN_PAGE: string;
  TEST?: any;
  API_BASE_URL: string;
}
interface Window {
  CONFIG: ICONFIG;
  _store?: any;
  singleSpa?: any;
  deployApps?: any[];
  System?: any;
}

// eslint-disable-next-line no-unused-vars
declare let CONFIG: ICONFIG;
// eslint-disable-next-line no-unused-vars
declare var globalTheme: any;

declare module 'react-redux';
declare module 'hsp-utils';
declare module 'single-spa-react';
declare module 'flyio/dist/npm/fly';
declare module 'js-base64';
declare module 'crypto-js/md5';

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
