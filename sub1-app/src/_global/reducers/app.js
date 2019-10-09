import { handleActions } from "redux-actions";
import { message } from "antd";
// import { goToLogin } from "../utils";
// import stroeProvider from "../utils/storeProvider";

// const key = "default_menu_collapsed";
// let defaultMenuCollapsed = window.localStorage.getItem(key);
// defaultMenuCollapsed = defaultMenuCollapsed || false;

const initialState = {
  currentSkin: "",
  currentSkinLoading: true,

  companyInfo: {},
  companyInfoLoading: false,

  menuList: [],
  menuListLoading: false,

  // 当前主菜单的菜单值，用于从menuList 中获取三级菜单
  currentMenuKey: "",

  menuState: "legalentities",
  // currentSkinHasChange: false, // 皮肤
  saveSkinLoading: false,
  alertInfo: {}
};

const reducers = handleActions(
  {
    APP: {
      // GET_CURRENT_SKIN: {
      //   PENDING: state => {
      //     // console.log("PENDING", action);
      //     return {
      //       ...state,
      //       // currentSkin: action.payload,
      //       currentSkinLoading: true
      //     };
      //   },

      //   FULFILLED: (state, action) => {
      //     // console.log("GET_CURRENT_SKIN/FULFILLED", state, action);
      //     return {
      //       ...state,
      //       currentSkin: action.payload.data,
      //       currentSkinLoading: false
      //     };
      //   },
      //   REJECTED: state => {
      //     // console.log("REJECTED", state, action);
      //     return {
      //       ...state,
      //       currentSkin: {},
      //       currentSkinLoading: false
      //     };
      //   }
      // },
      // 获取当前公司信息
      GET_COMPANY_INFO: {
        PENDING: state => {
          // console.log('GET_COMPANY_INFO/PENDING', action)
          return {
            ...state,
            companyInfoLoading: true
          };
        },

        FULFILLED: (state, action) => {
          // console.log('GET_COMPANY_INFO/FULFILLED', action)
          return {
            ...state,
            // 这个 success 后有可能返回 null。
            companyInfo: action.payload.data || {},
            companyInfoLoading: false
          };
        },
        REJECTED: state => {
          return {
            ...state,
            companyInfo: {},
            companyInfoLoading: false
          };
        }
      },
      // 获取菜单信息
      GET_MENU_DATA: {
        PENDING: state => {
          // console.log("PENDING", action);
          return {
            ...state,
            menuList: [],
            menuListLoading: true
          };
        },

        FULFILLED: (state, { payload }) => {
          return {
            ...state,
            menuList: payload.data || [],
            menuListLoading: false
          };
        },
        REJECTED: state => {
          // console.log("REJECTED", state, action);
          return {
            ...state,
            menuList: [],
            menuListLoading: false
          };
        }
      },
      // 保存主题
      SAVE_SKIN: {
        PENDING: state => {
          return {
            ...state,
            saveSkinLoading: true
          };
        },
        FULFILLED: state => {
          message.success("皮肤保存成功");
          return { ...state, saveSkinLoading: false };
        },

        REJECTED: state => {
          message.success("皮肤保存失败");
          return { ...state, saveSkinLoading: false };
        }
      },
      // 更改三级菜单状态
      CHANGE_MENU_STATE: (state, { payload }) => ({ ...state, menuState: payload }),

      SET_CURRENT_MENU_KEY: (state, action) => {
        return {
          ...state,
          currentMenuKey: action.payload
        };
      },
      // ALERT: (state, { payload }) => {
      //   return {
      //     ...state,
      //     alertInfo: payload
      //   };
      // },
      // showLoading: (state, { payload }) => {
      //   // console.log("showLoading");
      //   return {
      //     ...state,
      //     alertInfo: payload
      //   };
      // },
      // hideLoading: state => {
      //   // console.log("hideLoading");
      //   return {
      //     ...state,
      //     alertInfo: {}
      //   };
      // }
    }
  },
  initialState
);

export default reducers;
