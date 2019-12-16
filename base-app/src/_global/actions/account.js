// import { createActions } from "redux-actions";
// import api, { normalApi } from 'api';

export default {
  // 登录
  LOGIN: () => {},
  // 登出
  LOGOUT: () => {},
  GET_CURRENT: () => {
    console.log('base-app.GET_CURRENT');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: { name: 'xiaoming' } });
      }, 1200);
    });
  },
};
