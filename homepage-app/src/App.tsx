// import React from 'react';

// import './App.css';

import React, { useEffect, useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { dynamic } from 'hsp-utils';
import { Spin } from 'antd';
import api from 'api';

const getCurrent = () => api('/his-omp/api/employee/currentEmp').then((resp: any) => resp.data);
// import actions from '@/_global/actions';
// import accountReducers from '@/_global/reducers/account';
const Home = dynamic(() => import('./pages'));
// const PictureIndex = dynamic(() => import('./pictures'));
// const ContentIndex = dynamic(() => import('./content'));

const BasicLayout =
  process.env.NODE_ENV === 'development' && !process.env.MICRO
    ? dynamic(() => import('./layouts/BasicLayout'))
    : ({ children }: any) => <>{children}</>;

const App: React.FC = ({ match, globalEventDistributor, ...rest }: any) => {
  const [loading, setLoading] = useState(!process.env.MICRO);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !process.env.MICRO) {
      // 开发模式的时候需要获取当前用户信息
      const fetchData = async () => {
        setLoading(true);

        const currentEmp = await getCurrent()
          .then((resp: any) => resp.data)
          .catch((err: any) => {
            console.error(err);
            return {};
          });

        globalEventDistributor.dispatch({ type: 'CURRENT_EMP', payload: currentEmp });
        // globalEventDistributor.dispatch({ type: 'ROOT_MENU_LIST', payload: menuList });

        setLoading(false);
      };

      fetchData();
    }
  }, [globalEventDistributor]);
  // 因为 sub-app 只有等到 base-app 获取当前用户后才会挂载，所以只有dev 模式才需要
  if (process.env.NODE_ENV === 'development' && loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin />
      </div>
    );
  }

  return (
    <BasicLayout {...rest}>
      <Switch>
        <Route path={`${match.path}/home`} component={Home} />
        {/* <Route path={`${match.path}/picture`} component={PictureIndex} />
        <Route path={`${match.path}/content`} component={ContentIndex} /> */}
        <Redirect from={match.path} to={`${match.path}/home`} />
      </Switch>
    </BasicLayout>
  );
};

const mapStateToProps = (state: any) => {
  console.log('homepage-app.mapStateToProps', state);
  return {
    // loading: state.account.currentEmpLoading,
    menuList: state._root.rootMenuList,
    currentMenuKey: state._root.rootActiveMenuKey,
  };
};

export default connect(mapStateToProps)(App);
