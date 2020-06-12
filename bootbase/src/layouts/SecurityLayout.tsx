import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Spin } from 'antd';
import useRequest from '@umijs/use-request';
import { registerSubApps } from '../utils/singleSpaHelper';

function SecurityLayout({
  dispatch,
  children,
  currentEmp,
  rootMenuList,
  rootActiveMenuKey,
  globalEventDistributor,
}: any) {
  // 1、加载菜单信息
  // 2、加载用户信息
  // 2.1 注册子站点并同步用户信息
  // 2.2 同步菜单信息
  const token = localStorage.getItem('token');
  const isLogedIn = token && token !== '';
        console.log('base-app:global:CURRENT_EMP', CONFIG.API_BASE_URL);
  // dispatch({ type: 'APP_LOADING', payload: true });
  const { run: getUserInfo } = useRequest('/his-omp/api/employee/currentEmp', {
    manual: true,
    onSuccess: (resp: any) => {
      // console.log('base-app:global:CURRENT_EMP', resp);
      registerSubApps(globalEventDistributor, () => {
        // console.log('base-app:global:REGISTER_APP', 'OK');

        globalEventDistributor.dispatch({ type: 'CURRENT_EMP', payload: resp });
        globalEventDistributor.dispatch({ type: 'APP_LOADING', payload: false });
        globalEventDistributor.dispatch({ type: 'ROOT_MENU_LIST', payload: rootMenuList });
        globalEventDistributor.dispatch({
          type: 'ROOT_ACTIVE_MENU_KEY',
          payload: rootActiveMenuKey,
        });
      });
    },
  });

  useEffect(() => {
    // 没有登录
    if (!isLogedIn) return;
    if (currentEmp && currentEmp.id) return;

    console.log('加载用户信息');

    globalEventDistributor.dispatch({ type: 'APP_LOADING', payload: true });
    getUserInfo();
  }, [isLogedIn, currentEmp, dispatch, globalEventDistributor, getUserInfo]);

  const redirect = encodeURIComponent(window.location.href);
  // 没有登录，去登录
  if (!isLogedIn && window.location.pathname !== '/login') {
    return <Redirect to={`/login?redirect=${redirect}`} />;
  }

  return children;
}

export default connect((state: any) => {
  return {
    currentEmp: state._root.currentEmp,
    rootMenuList: state._root.rootMenuList,
    rootActiveMenuKey: state._root.rootActiveMenuKey,
    loading: state._root.loading,
  };
})(SecurityLayout);
