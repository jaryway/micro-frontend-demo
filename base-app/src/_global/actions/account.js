// import { createActions } from "redux-actions";
import api, { normalApi } from 'api';

export default {
  // 登录
  LOGIN: [
    data =>
      normalApi('/uaa/api/oauth/token', {
        method: 'post',
        // 使用 application/x-www-form-urlencoded 提交数据
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
          password: '$2a$10$XOVs4Z1YtPKqKwQVywG9j.xLAqXYRQLGZMGMrZDNbtl6pUC0Weteq',
        },
        data,
      }).then(resp => resp.data),
    (data, history) => history,
  ],
  // 登出
  LOGOUT: [
    () => api('/uaa/api/user/logout', { method: 'post' }).then(resp => resp.data),
    history => history,
  ],
  // 获取当前用户
  // GET_CURRENT: () => api('/his-omp/api/employee/currentEmp').then(resp => resp.data),
  GET_CURRENT: () => {
    console.log('base-app.GET_CURRENT');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: { name: 'xiaoming' } });
      }, 1200);
    });
  },
  // 修改个人信息
  UPDATE_PROFILE: data =>
    api('/his-omp/api/employee/myself_update', { method: 'POST', data }).then(resp => data),
  // 修改个人登录密码
  CHANGE_PASSWORD: data =>
    api('/uaa/api/user/changePwd', { method: 'POST', data }).then(resp => resp.data),
};
