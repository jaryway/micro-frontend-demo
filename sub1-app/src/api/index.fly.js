/* eslint-disable compat/compat */
// import axios from "axios";
// 基于 flyio.js 实现的 api
import Fly from 'flyio/dist/npm/fly';
// import { Base64 } from "js-base64";
import { notification } from 'antd';
// import { createHashHistory } from 'history';
import { getAccessTokenAsync, ShowMessage } from './utils';

export {
  normalApi,
  checkLoggedIn,
  getAccessTokenAsync,
  getTokenInfoFromLocalStorage,
} from './utils';

// const history = createHashHistory();
const showMessage = new ShowMessage();

function createApi() {
  const fly = new Fly();

  fly.config.baseURL = `${CONFIG.API_BASE_URL}`;
  fly.config.withCredentials = false;
  fly.interceptors.request.use(setToken2HeaderBeforeRequest);
  fly.interceptors.response.use(responseOkHandler, responseErrorHandler);

  const api = (url, newOptions = { method: 'GET' }) => {
    const { data = null } = newOptions;
    const isObject = typeof url === 'object';

    const options = isObject ? { ...url, ...newOptions } : { url, ...newOptions };
    const req = fly.request(options.url, null, { ...options, body: data });

    // 支持上传进度条
    if (options.onUploadProgress) {
      req.engine.upload.onprogress = options.onUploadProgress;
    }

    return req;

    // const http = fly.request(options.url, null, { ...options, body: data });
    // return http;
    //.then(checkStatus).then(resp => resp);
    // return http;
  };

  api.get = (url, newOptions) => api(url, { ...newOptions, method: 'GET' });
  api.post = (url, newOptions) => api(url, { ...newOptions, method: 'POST' });

  return api;
}

export function goToLogin(noReturnURL) {
  const returnurl = window.location.hash.length ? window.location.hash.substring(1) : '/';
  // 已经在登录页面了
  if (returnurl.toLowerCase().indexOf('returnurl') > -1) return false;

  // history.push({
  //   pathname: '/login',
  //   search: noReturnURL ? '' : `returnurl=${encodeURIComponent(returnurl)}`,
  //   //queryString.stringify({ returnurl })
  // });
}

export default createApi();

/*
 helper methods
 ----------------------------------------------------------------- */

/**
 * 发起请求前，把 access_token 放入请求头中
 * @param {*} request fly request 对象
 */
async function setToken2HeaderBeforeRequest(request) {
  console.log("setToken2HeaderBeforeRequest-1", request);

  const { url } = request;
  request = clearUpRequestParams(request);

  // 如果是去获取 token 则直接跳过
  if (url.indexOf('/token') > 0) return request;

  // log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`);
  const access_token = await getAccessTokenAsync();

  request.params = { ...request.params, __t: Date.now() };
  request.headers = { ...request.headers, Authorization: `Bearer ${access_token}` };

  return request;
}

/**
 * ok
 * @param {*} response
 */
function responseOkHandler(response) {
  // 没有发生错误的状态
  // status >= 200 && status < 300 || status === 304
  // console.log("responseOkHandler", response);
  const { code, message: errMessage } = response.data;

  // 登录接口是没有 code 的
  if (code === undefined) return response;

  // 没有发生错误
  if (code !== undefined && code === 0) return response;

  // 以下是code不为 0 的情况，此时返回 reject， reducer 中才会是reject状态。

  // 没有权限，提示信息
  if (code === 403) {
    notification.info({
      duration: 2,
      message: `${response.data.message}`,
      description: `请联系管理员开放功能权限！`,
    });
  }

  // else (code && errMessage) {
  //   showMessage(errMessage);
  //   return Promise.reject(response.data || response);
  // }

  if (errMessage === '系统错误') {
    showMessage('发生网络错误-系统错误');
  }

  // token 无效
  if (code === 401) transfer2LoginPage();

  return Promise.reject(response);
}

/**
 * 发生网络错误
 * @param {*} error
 */
function responseErrorHandler(error) {
  const { status, message: errMessage } = error || {};

  if (status && status === 401) {
    console.error('无效 token', errMessage);
    // 401 无效 token
    // todo: transfer to login page
    transfer2LoginPage();
  } else {
    // 其他网络错误状态
    // todo: 谈个提示，发生网络错误
    showMessage(errMessage || '网络错误');
  }

  return error;
}

/**
 * 跳转到登录页
 */
function transfer2LoginPage() {
  setTimeout(() => goToLogin(), 0);
}

/**
 * 整理请求参数，移除 params 中值为 undefined、null 的项
 * @param {*} request
 */
function clearUpRequestParams(request) {
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
