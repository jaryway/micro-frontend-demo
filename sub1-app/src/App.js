// import './App.css';
import React, { useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Table, Card, Spin } from 'antd';
// import Loadable from 'react-loadable';
import { dynamic, injectReducer } from 'hsp-utils';

import actions from '@/_global/actions';
import accountReducers from '@/_global/reducers/account';

const Home = dynamic(() => import('./Home'));

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '11',
    name: '胡彦斌01',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
console.log('app', 45454545454545);
function App({ globalEventDistributor, match, loading }) {
  useEffect(() => {
    globalEventDistributor.dispatch(actions.account.getCurrent());
  }, []);

  if (loading) return <Spin size='large' />;
  // return <div>4554545</div>;

  return (
    <Card bordered={false}>
      SUB-APP
      <ul>
        <li>
          <Link to='/sub1-app/home'>Home</Link>
        </li>
      </ul>
      <p>{name}</p>
      <div style={{ marginBottom: 8, paddingBottom: 8 }}>
        <Button
          type='primary'
          onClick={() => {
            // updateUserName(
            //   Math.random()
            //     .toString(16)
            //     .substring(2)
            // );
          }}
        >
          Click
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />
      <Route path='/sub1-app/home' component={Home} />
    </Card>
  );

  // return (
  //   <Switch>
  //     <Route path={`${match.path}/monthly`} exact={false} component={Monthly} />
  //     <Route
  //       path={`${match.path}/projectaudit`}
  //       exact={false}
  //       component={ProjectAudit}
  //     />
  //     <Route
  //       path={`${match.path}/productcontrol`}
  //       exact={false}
  //       component={ProductControl}
  //     />
  //     <Route
  //       path={`${match.path}/ssmpsystem`}
  //       exact={false}
  //       component={SsmpSystemAsync}
  //     />
  //     <Route
  //       path={`${match.path}/managecontrol`}
  //       exact={false}
  //       component={ManageControlAsync}
  //     />
  //     <Redirect from={match.url} to={`${match.path}/monthly`} />
  //   </Switch>
  // );
}

// const withReducer = injectReducer([
//   // { key: 'app', reducer: appReducers },
//   { key: 'account', reducer: accountReducers },
// ]);

// export default withReducer(
//   connect(state => {
//     return { loading: state.account.currentEmpLoading };
//   })(App)
// );
export default App;
