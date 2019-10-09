import api from "api";
export default {
  // 获取当期皮肤
  // GET_CURRENT_SKIN: () => api("/his-omp/api/getSkin").then(resp => resp.data),
  // // 保存皮肤
  // SAVE_SKIN: style =>
  //   api("/his-omp/api/saveSkin", { method: "GET", params: { style } }).then(resp => resp.data),
  GET_COMPANY_INFO: () => api("/uaa/api/company/info").then(resp => resp.data),
  GET_MENU_DATA: () => api({ method: "get", url: "/uaa/api/menu/list" }).then(resp => resp.data),
  SET_CURRENT_MENU_KEY: currentMenuKey => currentMenuKey,
  // ALERT: data => data,
  // showLoading: (type, msg) => ({ type, msg }),
  // hideLoading: noop => noop
};
