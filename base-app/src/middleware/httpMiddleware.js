// eslint-disable
import { /*PENDING, FULFILLED,*/ REJECTED } from "redux-promise-middleware";
// import {message} from 'antd';

// import actions from "../_global/actions";

// const { showLoading, hideLoading } = actions.app;
// let timerId;

export default function httpMiddleware() {
  return next => action => {
    // console.log('asyncMiddleware', action)
    // console.log(dispatch, action, getState)

    if (!action || !action.type) return next(action);
    if (action.type.endsWith(REJECTED)) {
      const { message } = action.payload;
      // console.log('httpMiddleware', message,REJECTED, action.type.replace(REJECTED, "HttpRequestCancel"))
      if (message === "httpRequestCancel") {
        return next({
          ...action,
          type: action.type.replace(REJECTED, "HttpRequestCancel")
        });
      }

      // // ajax 发生错误时显示/隐藏提示
      // dispatch(showLoading("error", message || "网络错误，请重试!"));
      // clearTimeout(timerId);
      // timerId = setTimeout(() => {
      //   dispatch(hideLoading());
      // }, 2000);

      return next(action);
    }
    return next(action);
  };
}
