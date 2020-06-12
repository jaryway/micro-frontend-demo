import { handleActions } from 'redux-actions';
import { message } from 'antd';
// import { goToLogin } from "../utils";
// import stroeProvider from "../utils/storeProvider";

// const key = "default_menu_collapsed";
// let defaultMenuCollapsed = window.localStorage.getItem(key);
// defaultMenuCollapsed = defaultMenuCollapsed || false;

const initialState = {
  // menuList: [],
  // menuListLoading: false,

  // 当前主菜单的菜单值，用于从menuList 中获取三级菜单
  rootActiveMenuKey: '',

  // menuState: 'legalentities',
};

const reducers = handleActions(
  {
    APP: {
      // // 更改三级菜单状态
      // CHANGE_MENU_STATE: (state, { payload }) => ({ ...state, menuState: payload }),

      // SET_CURRENT_MENU_KEY: (state, action) => {
      //   return {
      //     ...state,
      //     rootActiveMenuKey: action.payload,
      //   };
      // },
    },
  },
  initialState
);

export default reducers;
