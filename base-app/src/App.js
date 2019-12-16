import './App.css';
import React, { useState, useCallback, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Spin, message } from 'antd';
import { dynamic, injectReducer } from 'hsp-utils';

import actions from '@/_global/actions';
import accountReducer from '@/_global/reducers/account';

const { Header, Sider, Content } = Layout;
const menuList = [
  { key: 'k1', icon: 'home', title: 'Home', link: '/' },
  { key: 'k2', icon: 'user', title: 'User', link: '/user' },
  { key: 'k3', icon: 'message', title: 'About', link: '/about' },
  {
    key: 'k4',
    icon: 'appstore',
    title: 'Sub1App',
    link: '/sub1-app',
    children: [{ key: 'k3-0', title: '/Sub1App/Home', link: '/sub1-app/home' }],
  },
  { key: 'k5', icon: 'shop', title: 'Sub2App', link: '/sub2-app' },
];

const { SubMenu } = Menu;

function renderMenu(menus) {
  return menus.map(item => {
    const { key, icon, title, link, children } = item;
    if (children && children.length) {
      return (
        <SubMenu
          key={key}
          title={
            <span>
              <Icon type='mail' />
              <span>{title}</span>
            </span>
          }
        >
          {renderMenu(children)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={key} link={link}>
        {icon && <Icon type={icon} />}
        <span> {title} </span>
      </Menu.Item>
    );
  });
}

const User = dynamic(() => import('./User'));
const About = dynamic(() => import('./About'));

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function SubApp() {
  return (
    <div id='subapp'>
      <h2>SubApp</h2>
    </div>
  );
}

function App({ history, globalEventDistributor, getCurrent, loading, ...rest }) {
  const [collapsed, setCollapsed] = useState(false);
  // console.log('rest', rest);
  useEffect(() => {
    getCurrent().then(() => {
      globalEventDistributor.dispatch({ type: 'DID_GET_CURRENT' });
    });
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const onMenuClick = useCallback(link => {
    history.push(link);
  }, []);

  if (loading)
    return (
      <div style={{ margin: '60px auto', textAlign: 'center' }}>
        <Spin size='large' />
      </div>
    );

  return (
    <Layout id='components-layout-demo-custom-trigger'>
      <Sider trigger={null} collapsible collapsed={collapsed} theme='light'>
        <div className='logo' />
        <Menu
          theme='light'
          mode='inline'
          defaultSelectedKeys={['k1']}
          onClick={({ item }) => {
            onMenuClick(item.props['link']);
          }}
        >
          {renderMenu(menuList)}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Icon
            className='trigger'
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/user' component={User} />
            <Route path='/about' component={About} />
            <Route path='/*-app' component={SubApp} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}

const withReducer = injectReducer([{ key: 'account', reducer: accountReducer }]);
const mapStateToProps = state => {
  console.log('base-app.state', state);
  return { loading: state.account.currentEmpLoading };
};
const mapDispatchToProps = { getCurrent: actions.account.getCurrent };
export default withReducer(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
