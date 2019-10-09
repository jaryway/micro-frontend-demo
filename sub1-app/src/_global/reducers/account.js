import { handleActions } from "redux-actions";
import { message } from "antd";
import Cookies from "react-cookie/lib/Cookies";
// import queryString from "query-string";

const initialState = {
  currentEmp: {},
  currentEmpLoading: true,

  loginInfo: {},
  loginInfoLoading: false,

  submitting: false
  // test: {},
  // currentSkinHasChange: false, // 皮肤
};



const reducers = handleActions(
  {
    ACCOUNT: {
      LOGIN: {
        PENDING: state => {
          return {
            ...state,
            // loginInfo: action.payload,
            loginInfoLoading: true
          };
        },

        FULFILLED: (state, action) => {
          // console.log("ACCOUNT/LOGIN/FULFILLED", action);
          message.success("登录成功");

          const { payload } = action; //  action.payload
          const { expires_in } = payload;
          const cookies = new Cookies();
          const expires = new Date().getTime() / 1000 + (expires_in - 10); // 提前10s过期
          const token = { ...payload, expires };

          cookies.set("token", expires_in, { path: "/" }); // 设置cookie
          window.localStorage.setItem("token", JSON.stringify(token)); // 保存 token 到 localStorage 中

          return {
            ...state,
            loginInfo: payload,
            loginInfoLoading: false // 成功了就让它一直loading，避免重复点击提交
          };
        },
        REJECTED: (state, { payload }) => {
          // console.log("REJECTED", payload.message);
          // message.error(`登录失败：${payload.message}`);
          return {
            ...state,
            loginInfo: undefined,
            loginInfoLoading: false
          };
        }
      },

      LOGOUT: {
        FULFILLED: (state, action) => {
          // console.log("LOGOUT/FULFILLED", action);
          // 登出成功，去到登录页
          window.localStorage.removeItem("token");
          /* reduce中 不能 dispatch；
        因为 goToLogin 会造成component的 unmount ，
        unmount 中如果还有dispatch，则会报错。
        */
          //  stroeProvider.clearStore();
          //   setTimeout(() => {
          //     stroeProvider.clearStore();
          //     goToLogin(action.meta, true);
          //     /*window.location.reload(true);*/
          //   }, 0);
          return { ...state };
        }
      },
      GET_CURRENT: {
        PENDING: (state, action) => {
          return {
            ...state,
            currentEmp: action.payload,
            currentEmpLoading: true
          };
        },

        FULFILLED: (state, action) => {
          console.log("GET_CURRENT/FULFILLED", action);
          return {
            ...state,
            currentEmp: action.payload.data,
            currentEmpLoading: false
          };
        },
        REJECTED: state => {
          // console.log("REJECTED", state, action);
          return {
            ...state,
            currentEmp: {},
            currentEmpLoading: true
          };
        }
      },
      // 修改个人信息
      UPDATE_PROFILE: {
        PENDING: state => {
          return {
            ...state,
            submitting: true
          };
        },
        FULFILLED: (state, { payload }) => {
          // console.log(payload, "udpate----payload");
          message.success("修改成功");
          return {
            currentEmp: { ...state.currentEmp, ...payload },
            submitting: false
          };
        },
        REJECTED: state => {
          // message.error("修改失败");
          return {
            ...state,
            submitting: false
          };
        }
      },
      // 修改个人登录密码
      CHANGE_PASSWORD: {
        PENDING: state => {
          return {
            ...state,
            submitting: true
          };
        },
        FULFILLED: state => {
          message.success("修改成功");
          return {
            ...state,
            submitting: false
          };
        },
        REJECTED: state => {
          // message.error("修改失败");
          return {
            ...state,
            submitting: false
          };
        }
      },

      SYNC_LOCAL_INFO: (state, action) => {
        // console.log('UPDATE_CURRENT')
        return {
          ...state,
          currentEmp: action.payload
        };
      }
    }
  },
  initialState
);

export default reducers;
