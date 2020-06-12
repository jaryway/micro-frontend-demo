import './style';
import React, { useState, useCallback } from 'react';
// import { Switch, Route } from 'react-router-dom';
// import { connect } from 'react-redux';
import classNames from 'classnames';
import { Layout, Menu, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
const menuList = [
  {
    key: 'k1',
    icon: 'appstore',
    title: '主菜单1',
    link: '/homepage-app',
    children: [
      { key: 'k1-0', title: '图片管理', link: '/homepage-app/mudule1' },
      { key: 'k1-1', title: '分类管理', link: '/homepage-app/mudule2' },
      { key: 'k1-2', title: '内容管理', link: '/homepage-app/mudule3' },
    ],
  },
  {
    key: 'k2',
    icon: 'appstore',
    title: '主菜单2',
    link: '/homepage-app/cloud',
    children: [
      { key: 'k2-0', title: '图片管理', link: '/homepage-app/cloud/mudule1' },
      { key: 'k2-1', title: '分类管理', link: '/homepage-app/cloud/mudule2' },
      { key: 'k2-2', title: '内容管理', link: '/homepage-app/cloud/mudule3' },
    ],
  },
];

function renderMenu(menus) {
  return menus.map(item => {
    const { key, icon, title, link, children } = item;
    if (children && children.length) {
      return (
        <SubMenu
          key={key}
          title={
            <span>
              <Icon type={icon} />
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

function BasicLayout({ history, children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const onMenuClick = useCallback(link => {
    history.push(link);
  }, []);

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
          style={{ minHeight: 'calc(100vh - 64px)' }}
        >
          {renderMenu(menuList)}
        </Menu>
      </Sider>
      <Layout className={classNames('layout-main', { 'layout-main-mini': collapsed })}>
        <Header
          style={{
            background: '#fff',
            height: 50,
            lineHeight: '50px',
            padding: 0,
          }}
        >
          <Icon
            className='trigger'
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
        </Header>
        <Content
          style={{
            // margin: '24px 16px',
            // padding: 24,
            // background: '#fff',
            minHeight: 'calc(100vh - 64px)',
            position: 'relative',
          }}
        >
          {/* <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/user' component={User} />
          <Route path='/about' component={About} />
          <Route path='/*-app' component={SubApp} />
        </Switch> */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;
