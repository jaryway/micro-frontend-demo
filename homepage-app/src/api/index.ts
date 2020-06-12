import Fly from 'flyio/dist/npm/fly';
import { Cookies } from 'react-cookie';
// eslint-disable-next-line no-unused-vars
import { FlyError } from 'flyio';
import { message, notification } from 'antd';
// import { createHashHistory as createHistory } from 'history';
import { Base64 } from 'js-base64';
import md5 from 'crypto-js/md5';

// import { normalApi } from './utils';

const canGetUserNameFromUrl =
  process.env.REACT_APP_APP_NAME !== 'base-app' &&
  process.env.NODE_ENV === 'development' &&
  !process.env.MICRO;

let refreshTokenPromise: any = null;
// const history = createHistory();
// 请求拦截
// 1、请求前把在头部添加 access_token;
// 2、请求返回，如果是返回 401 token 无效
// 2.1 拿token qu

interface RequestOptionsProps extends Object {
  url?: string;
  data?: Object;
  params?: Object;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  auth?: any;
  headers?: any;
}

function createApi(appendToken: boolean = true) {
  const fly = new Fly();
  fly.config.baseURL = `${CONFIG.API_BASE_URL}`;
  fly.config.withCredentials = false;
  fly.refreshTokenPromise = null;
  appendToken && fly.interceptors.request.use(appendAccessToken2Header(fly));
  fly.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

  const api = (
    url: string | RequestOptionsProps,
    options: RequestOptionsProps = {}
  ): Promise<any> => {
    let newOptions: any = { url, ...options };

    if (typeof url === 'object') {
      newOptions = { ...url, ...options };
    }

    // 把 data 转成 body
    const { data, auth, ...rest } = newOptions;
    newOptions = rest;

    // 登录接口
    if (auth) {
      const { username, password } = auth;
      const encode = window.btoa || Base64.encode;

      newOptions = {
        ...rest,
        headers: {
          ...rest.headers,
          Authorization: `Basic ${encode(`${username}:${password}`)}`,
        },
      };
    }

    const req = fly.request(rest.url, null, { ...newOptions, body: data });

    // console.log('newOptions', newOptions, options);
    // 添加支持上传进度条
    if (newOptions.onUploadProgress) {
      req.engine.upload.onprogress = newOptions.onUploadProgress;
    }

    return req;
  };

  api.get = (url: string | RequestOptionsProps, newOptions: RequestOptionsProps) =>
    api(url, { ...newOptions, method: 'GET' });
  api.post = (url: string | RequestOptionsProps, newOptions: RequestOptionsProps) =>
    api(url, { ...newOptions, method: 'POST' });

  return api;
}

export default createApi();
export const normalApi = createApi(false);

/**
 * 从本地存储中获取 token 信息
 */
export function getTokenInfoFromLocalStorage() {
  const cookies = new Cookies();
  const localToken = localStorage.getItem('token');
  const token = localToken ? JSON.parse(localToken) : {};
  const cookieToken = cookies.get('token');

  // cookie和localStorage中都没有token
  if (!cookieToken || !token) {
    return { loggedin: false, expiresed: true };
  }

  const { access_token, refresh_token } = token;
  const now_timestamp = Date.now() / 1000; //new Date().getTime() 的单位是毫秒，要除以100
  // console.log("hhh",token.expires +" &&&& "+now_timestamp);
  // 如果 token 过期，而 refresh token 没有过期，去刷新token
  if (token.expires - now_timestamp <= 0) {
    return { loggedin: true, expiresed: true, refresh_token };
  }

  return { loggedin: true, expiresed: false, access_token, refresh_token };
}

export function getAccessTokenAsync() {
  const { loggedin, expiresed, access_token, refresh_token } = getTokenInfoFromLocalStorage();

  // 已登录，没有过期，一切正常
  if (loggedin && !expiresed && access_token) return Promise.resolve(access_token);

  if (canGetUserNameFromUrl) return Promise.resolve(getTokenFromUrl());

  // 如果 refreshToken 不是在请求中，给 fly.refreshTokenPromise 赋值
  if (refreshTokenPromise === null) {
    refreshTokenPromise = refreshTokenAsync(refresh_token);
  }

  return Promise.resolve(
    refreshTokenPromise.then((nextAccessToken: string) => {
      refreshTokenPromise = null; // 记得置空
      return nextAccessToken;
    })
  );
}

export function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}

/** 
 * helper methods
 ----------------------------------------------------------------------*/

/**
 * 检查是否登录
 */
export function checkLoggedIn() {
  const { loggedin, expiresed } = getTokenInfoFromLocalStorage();
  // 已经登录，并且 access_token 没有过期
  return loggedin && !expiresed;
}

function saveTokenToLocalStorage(token: any) {
  const { expires_in } = token;
  const cookies = new Cookies();
  const expires = new Date().getTime() / 1000 + (expires_in - 10); // 提前10s过期
  const finalToken = { ...token, expires };

  cookies.set('token', expires_in, { path: '/' }); // 设置cookie
  localStorage.setItem('token', JSON.stringify(finalToken));
}

/**
 * 整理请求参数，移除 params 中值为 undefined、null 的项
 * @param {*} request
 */
function clearUpRequestParams(request: any) {
  //   console.log('clearUpRequestParams', request);
  const { body, params: _params, method } = request;
  const mergeParams = {
    ..._params,
    ...(method.toUpperCase() === 'GET' ? body : {}),
  };

  // 移除 params 中 undefined 、null 数据
  const params = Object.entries(mergeParams)
    .filter(([, v]) => !(v === undefined || v === null))
    .reduce((prev, [k, v]) => ({ ...prev, [k]: v }), {});

  if (method.toUpperCase() === 'GET') request.body = {};
  request.params = params;

  return request;
}

function appendAccessToken2Header(_fly: any) {
  return async (req: any) => {
    // console.log('appendAccessToken2Header');
    const { url } = req;
    const request = clearUpRequestParams(req);
    // eslint-disable-next-line prefer-promise-reject-errors
    // return Promise.reject({ status: 401 });
    // return Promise.reject(request);
    // 如果是去获取 token 则直接跳过
    if ((url || '').indexOf('/token') > 0) return Promise.resolve(request);

    // console.log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`);

    return getAccessTokenAsync().then((resp) => {
      // 此处要返回原来的 request 才会，原来的请求才会继续进行
      request.headers = { ...request.headers, Authorization: `Bearer ${resp}` };
      return request;
    });
  };
}
// 刷新 token
function refreshTokenAsync(refresh_token: string) {
  const options: RequestOptionsProps = {
    method: 'POST',
    auth: {
      username: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
      password: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
    },
    data: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  // 发起刷新 token 请求
  return normalApi('/uaa/api/oauth/token', options)
    .then((resp: any) => {
      const { data } = resp;
      console.log('refreshTokenAsync-resp');
      // token 刷新成功后保存新的 token 信息到本地
      saveTokenToLocalStorage(data);
      return data.access_token;
    })
    .catch((ex: any) => {
      console.log('refreshTokenAsync', ex);
    });
}

// status=200 的情况，如果 code 不为 0，全部 reject，这样 reducer 才会走 reject 条件
function handleSuccessResponse(response: any) {
  console.log('handleErrorResponse', response);
  const { code, message: errMessage } = response.data;

  // 登录接口是没有 code 的
  if (code === undefined) return response;

  // 没有发生错误
  if (code !== undefined && code === 0) return response;

  // 以下是code不为 0 的情况，此时返回 reject， reducer 中才会是 reject 状态。

  // 没有权限，提示信息
  if (code === 403) {
    notification.info({
      duration: 2,
      message: `${response.data.message}`,
      description: `请联系管理员开放功能权限！`,
    });
  }

  if (errMessage === '系统错误') {
    message.error('系统错误');
  }

  // token 无效
  if (code === 401) logout();

  return Promise.reject(response);
}

// 请求发生错误时，跳转去登录页
function handleErrorResponse(err: FlyError) {
  console.log('handleErrorResponse', err);
  const { status, request } = err || {};
  if (request && request.url && request.url.includes('/uaa/api/oauth/token'))
    return Promise.reject(err);

  if (status === 401) {
    logout();
  } else if (status === 400) {
    message.error('网络错误');
  } else {
    message.error('网络错误');
  }
  return err;
}

/** helper Methods
 * --------------------------------------------------------*/
/**
 * 从 url 中获取用户名和密码
 */
function getUserNameAndPasswordFromUrl() {
  if (window.location.search.length < 2)
    return { username: 'test1@zchl', password: md5(md5('1qaz@WSX').toString()).toString() };

  const query: any = window.location.search
    .slice(1)
    .split('&')
    .map((m) => m.split('='))
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});

  return { username: query.un, password: md5(md5(query.pwd).toString()).toString() };
}

function getTokenFromUrl() {
  console.log('getTokenFromUrl');
  const data = Object.entries({
    grant_type: 'password',
    ...getUserNameAndPasswordFromUrl(),
  })
    .map((m) => m.join('='))
    .join('&');

  const options: RequestOptionsProps = {
    method: 'POST',
    // 使用 application/x-www-form-urlencoded 提交数据
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    auth: {
      username: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
      password: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
    },
    data,
  };

  return normalApi('/uaa/api/oauth/token', options)
    .then((resp: any) => {
      // console.log(resp, "resp");
      return resp.data.access_token;
    })
    .catch((err: any) => {
      console.log('err', err);
      return '';
    });
}
