/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MICRO: 'false' | 'true';
    readonly PUBLIC_URL: string;
  }
}

interface Window {
  CONFIG: {
    REGISTER_TYPE: 'split' | 'merge';
  };
  System: any;
  appRegisterType: 'split' | 'merge';
  deployApps?: any[];
}

declare var window: Window;
