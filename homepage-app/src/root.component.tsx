/// <reference path='./global.d.ts' />
import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
// import { dynamic } from 'hsp-utils';
import zhCN from 'antd/lib/locale/zh_CN';
import 'moment/locale/zh-cn'; // 引入 moment 的中文语言包

// import './utils/moment';
import './assets/less/console.less'; // 按需引入本项目所需的样式

// const BasicLayout = dynamic(() => import(`./App`));

function RootComponent({ history, globalEventDistributor, store }: any) {
  // const [state] = useState({ store, globalEventDistributor, history });
  // const customProps = { globalEventDistributor };

  // useEffect(() => {
  //   window._store = store;
  // }, [store]);
  // console.log('historyhistoryhistory-0', history);
  // 这里通过消息总线 通知其他应用更新路由（不能省，否则跳转去其他子应用会导致不能正确激活页面）
  useEffect(() => {
    // const unlisten = history.listen((location: any, action: any) => {
    //   if (action === 'PUSH') {
    //     globalEventDistributor.dispatch({
    //       type: 'to',
    //       path: location.pathname,
    //       owner: 'base',
    //     });
    //   }
    // });
    // return unlisten;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router history={history}>
          <Switch>
            <Route
              path='/homepage-app'
              render={() => {
                return (
                  <div>
                    <button
                      type='button'
                      onClick={() => {
                        history.push('/sub2-app/home');
                      }}
                    >
                      sub2-app
                    </button>{' '}
                    <button
                      type='button'
                      onClick={() => {
                        history.push('/workflow-app/todo/list');
                      }}
                    >
                      workflow
                    </button>
                  </div>
                );
              }}
              // render={(props: any) => <BasicLayout {...customProps} {...props} />}
            />
            {!process.env.MICRO && <Redirect from='/' to='/homepage-app' />}
          </Switch>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default RootComponent;
