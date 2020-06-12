import { FlyRequestConfig, FlyPromise } from 'flyio';

interface Options extends FlyRequestConfig {
  data?: any;
  onUploadProgress?: (e: ProgressEvent) => void;
}

// declare function api<T = any>(url: string, option?: Options): FlyPromise<T>;

// declare namespace api {
//   function get<T = any>(url: string, options?: Options): FlyPromise<T>;
//   function post<T = any>(url: string, options?: Options): FlyPromise<T>;
// }


interface Api {
  <T = any>(url: string, option?: Options): FlyPromise<T>;

  get<T = any>(url: string, options?: Options): FlyPromise<T>;
  post<T = any>(url: string, options?: Options): FlyPromise<T>;
}

declare const api: Api;

export default api;
