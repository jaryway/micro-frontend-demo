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

function App({ getCurrent, loading = false }) {
  useEffect(() => {
    getCurrent();
  }, []);

  if (loading) return <Spin size='large' />;

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
        <Button type='primary' onClick={() => {}}>
          Click
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />
      <Route path='/sub1-app/home' component={Home} />
    </Card>
  );
}

const withReducer = injectReducer([
  // { key: 'app', reducer: appReducers },
  { key: 'account', reducer: accountReducers },
]);

const mapStateToProps = state => {
  console.log('sub1-app.mapStateToProps', state);
  return { loading: state.account.currentEmpLoading };
};
const mapDispatchToProps = (dispatch, { globalEventDistributor }) => {
  const { base: baseState } = globalEventDistributor.getState();
  console.log('sub1-app.mapDispatchToProps', baseState);
  return {
    getCurrent: () => {
      // 如果是微前端模式，则直接将 base 中加载好的信息，同步到当前应用中
      // 否则，发起 http 请求 account 信息
      return dispatch(
        actions.account.getCurrent(process.env.MICRO ? baseState.account.currentEmp : undefined)
      );
    },
  };
};

export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
