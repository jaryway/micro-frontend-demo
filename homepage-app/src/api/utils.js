import Fly from 'flyio/dist/npm/fly';
import { Cookies } from 'react-cookie';
import { Base64 } from 'js-base64';
import md5 from 'crypto-js/md5';
import { message } from 'antd';

let showMessage;

function createApi() {
  const fly = new Fly();
  showMessage = new ShowMessage();
  fly.config.baseURL = `${window.CONFIG.API_BASE_URL}`;
  fly.interceptors.response.use(responseOkHandler, responseErrorHandler);

  function api(url, newOptions = { method: 'GET' }) {
    const { data = null, auth } = newOptions;

    // 登录接口
    if (auth) {
      const { username, password } = auth;
      const encode = window.btoa || Base64.encode;
      newOptions.headers.Authorization = `Basic ${encode(username + ':' + password)}`;
    }

    return fly.request(url, null, { ...newOptions, body: data });
  }

  api.get = (url, newOptions) => api(url, { ...newOptions, method: 'GET' });
  api.post = (url, newOptions) => api(url, { ...newOptions, method: 'POST' });

  return api;
}

export const normalApi = createApi();

/**
 * 获取 access_token
 */
export async function getAccessTokenAsync() {
  const { loggedin, expiresed, access_token, refresh_token } = getTokenInfoFromLocalStorage();

  // 已登录，一切正常
  if (loggedin && !expiresed && access_token) return access_token;

  let accessToken = '';

  if (process.env.NODE_ENV === 'development') {
    accessToken = await getTokenFromUrl();
  } else if (loggedin && expiresed && refresh_token) {
    // 已经登录，access_token 已过期，去刷新 access_token
    accessToken = await refreshTokenAsync(refresh_token);
  }

  return accessToken;
}

/**
 * 检查是否登录
 */
export function checkLoggedIn() {
  const { loggedin, expiresed } = getTokenInfoFromLocalStorage();
  // 已经登录，并且 access_token 没有过期
  return loggedin && !expiresed;
}

/**
 * 从本地存储中获取 token 信息
 */
export function getTokenInfoFromLocalStorage() {
  const cookies = new Cookies();
  const token = JSON.parse(localStorage.getItem('token') || null);
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

  return { loggedin: true, expiresed: false, access_token };
}

/**
 * 显示信息
 * @param {*} duration
 */
export function ShowMessage(duration = 1) {
  let pending = false;

  return function(errMessage) {
    if (pending) return;
    pending = true;
    message.error(errMessage, duration, () => {
      setTimeout(() => {
        pending = false;
      }, 300);
    });
  };
}

/** 
 * helper methods
 ----------------------------------------------------------------------*/

function responseOkHandler(response) {
  // 没有发生错误的状态
  // status >= 200 && status < 300 || status === 304
  // console.log("responseOkHandler", response);
  const { code, message: errMessage } = response.data;

  // 登录接口是没有 code 的
  if (code === undefined) return response;

  // 没有发生错误
  if (code !== undefined && code === 0) return response;

  // 以下是 code 不为 0 的情况，此时返回 reject， reducer 中才会是reject状态。

  // else (code && errMessage) {
  //   showMessage(errMessage);
  //   return Promise.reject(response.data || response);
  // }

  // if (errMessage === "系统错误") {
  showMessage(errMessage || '发生网络错误');
  // }

  return Promise.reject(response.data || response);
}

/**
 * 发生网络错误
 * @param {*} error
 */
function responseErrorHandler(error) {
  const { message: errMessage, response } = error || {};
  const { message: message1 } = (response && response.data) || {};
  console.log(error);
  // todo: 谈个提示，发生网络错误
  showMessage(message1 || errMessage || '网络错误');
  return error;
}

/**
 * 使用 refresh_token 刷新 access_token
 * @param {string} refresh_token 用于刷新的Token
 */
async function refreshTokenAsync(refresh_token) {
  //
  const resp = await normalApi.post('/uaa/api/oauth/token', {
    params: { grant_type: 'refresh_token', refresh_token },
    auth: {
      username: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
      password: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
    },
  });

  const { access_token, expires_in } = resp.data;

  console.log('access token 刷新成功', access_token);

  // 提前 10s 过期
  const expires = Date.now() / 1000 + (expires_in - 10);
  const token = { ...resp.data, expires };

  localStorage.setItem('token', JSON.stringify(token));

  return access_token;
}

/** helper Methods
 * --------------------------------------------------------*/
/**
 * 从 url 中获取用户名和密码
 */
function getUserNameAndPasswordFromUrl() {
  // if (window.location.search.length < 2) return { username: 'superadmin@superadmin', password: 'admin' };
  if (window.location.search.length < 2) {
    // return { username: 'wjm_admin@cwb', password: '123456' };
    // return { username: 'wjm_admin@cwb', password: md5(md5('1qaz@WSX').toString()).toString() };
    return { username: 'xiao@zchl', password: md5(md5('1qaz@WSX').toString()).toString() };
  } // 普通用户

  const query = window.location.search
    .slice(1)
    .split('&')
    .map(m => m.split('='))
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});

  return { username: query.un, password: query.pwd };
}

async function getTokenFromUrl() {
  // console.log("getTokenFromUrl");
  const data = Object.entries({
    grant_type: 'password',
    ...getUserNameAndPasswordFromUrl(),
  })
    .map(m => m.join('='))
    .join('&');

  return normalApi('/uaa/api/oauth/token', {
    method: 'post',
    // 使用 application/x-www-form-urlencoded 提交数据
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    auth: {
      username: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
      password: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
    },
    data,
  })
    .then(resp => {
      // console.log(resp, "resp");
      return resp.data.access_token;
    })
    .catch(err => {
      console.log('err', err);
      // resolve("");
      return '';
    });
}
