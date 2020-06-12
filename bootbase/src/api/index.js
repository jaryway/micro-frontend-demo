/* eslint-disable compat/compat */
import axios from "axios";
// import { Cookies } from 'react-cookie';

import { notification } from "antd";
// import url from 'url'
// import queryString from 'query-string';
import { goToLogin } from "../utils";
import { getAccessTokenAsync } from "../utils/account";



// 检查 http 状态和 code 的状态
function checkStatus(response) {
  // console.log('checkStatus', response);
  // 发生错误(http状态码不是200的情况)，直接 reject,
  if (response.status < 200 || response.status > 300)
    return Promise.reject(response.data || response);

  const {
    data: { code }
  } = response;
  // console.log("checkStatus0", code)

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
      description: `请联系管理员开放功能权限！`
    });
    // console.log('response', response);
    return Promise.reject(response.data || response);
  }

  // 其他 code 不等于 0 的情况
  // notification.warn({
  //   duration: 2,
  //   message: `发生错误`,
  //   description: ` code : ${response.data.code} - ${response.data.message}`,
  // });

  return Promise.reject(response.data || response);
}

// console.log("fly", fly, fly.prototype);
export const normalApi = (url, newOptions = { method: "get" }) => {
  let normal = null;

  if (typeof url === "object") {
    normal = normalAxios({ ...url });
  } else normal = normalAxios({ url, ...newOptions });

  normal = normal.then(checkStatus).then(resp => resp);

  return normal;
};

normalApi.get = (url, newOptions) => normalApi({ url, ...newOptions, method: "get" });
normalApi.post = (url, newOptions) => normalApi({ url, ...newOptions, method: "post" });

// import MockAdapter from 'axios-mock-adapter';
const normalAxios = axios.create({
  baseURL: `${CONFIG.API_BASE_URL}`
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

/**
 * 拦截验证和跳转登录
 * 实现逻辑：每次发起请求前拦截请求并获取本地存储中token信息，在header加上token信息。
 * 获取本地token信息时，先判断是否过期。如果access_token过期refresh_token没有过期，则用refresh_token刷新access_token。
 * access_token和refresh_token都过期，则跳转登录。
 */

const pending = [];
const CancelToken = axios.CancelToken;
// 取消重复请求
const removePending = (config, executeCancel = true) => {
  pending.forEach((item, index) => {
    if (item.u === `${config.url}&${config.method}`) {
      // 当当前请求在数组中存在时执行函数体
      executeCancel && item.f("httpRequestCancel"); // 执行取消操作
      pending.splice(index, 1); // 把这条记录从数组中移除
    }
  });
};

// 拦截请求，获取access token，并加到header中
normalAxios.interceptors.request.use(async config => {
  // const { headers } = config;
  const nextConfig = { ...config };
  const { canCancel } = nextConfig.headers;
  // 删除 headers 中的 canCancel；避免报跨域错误
  delete nextConfig.headers.canCancel;

  if (canCancel) {
    removePending(nextConfig); //在一个ajax发送前执行一下取消操作
    // console.log("config", headers.canCancel)
    nextConfig.cancelToken = new CancelToken(c => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: `${config.url}&${config.method}`, f: c });
    });
  }

  // config.withCredentials = true;
  //如果是去获取token则直接跳过
  if (nextConfig.url.indexOf("/token") > 0) return config;

  // url上添加随机随机数，解决ie 从缓存获取数据的问题
  // const queryObj = queryString.parseUrl(config.url).query;
  // const newConfig = { ...nextConfig, params: { ...nextConfig.params, __t: Date.now() } };

  const access_token = await getAccessTokenAsync();

  return {
    ...nextConfig,
    params: { ...nextConfig.params, __t: Date.now() },
    // cancelToken:source.token,
    headers: {
      ...nextConfig.headers,
      Authorization: `Bearer ${access_token}`
    }
  };
});

// 拦截返回值，当报401错误时跳转到登录页面
normalAxios.interceptors.response.use(
  resp => {
    removePending(resp.config, false);
    // 有些接口401没有返回异常，不能通过error去拦截跳转
    if (resp.data && resp.data.code && resp.data.code === 401) {
      goToLogin();
      return Promise.reject(resp);
    }
    return resp;
  },
  ex => {
    // token 过期或者无效时,直接跳转到登录页面
    console.log("ex", ex.response);
    // if (ex.message === "httpRequestCancel") return;
    if (ex.response) {
      const status = ex.response.status;
      if (status && status === 401) {
        goToLogin();
      }
      return Promise.reject(ex.response.data || ex.response);
    }
    return Promise.reject(ex);
  }
);

const api = (url, newOptions) => {
  let _axios = null;

  if (typeof url === "object") {
    _axios = normalAxios({ ...url });
  } else _axios = normalAxios({ url, ...newOptions });

  _axios = _axios.then(checkStatus).then(resp => resp);
  // .catch(error => {
  //   // console.log(error);
  //   throw error;
  // });

  return _axios;
};

api.get = (url, newOptions) => api(url, { ...newOptions, method: "get" });
api.post = (url, newOptions) => api(url, { ...newOptions, method: "post" });

export default api;
