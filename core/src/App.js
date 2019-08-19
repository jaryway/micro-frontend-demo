import 'antd/dist/antd.css';
import './App.css';
import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import Loadable from 'react-loadable';
// import Home from './Home';
const loading = noop => <div />;

const HomeAsync = Loadable({ loading, loader: () => import('./Home') });
const SubModuleAsync = Loadable({ loading, loader: () => import('./SubModule') });

const { Header, Sider, Content } = Layout;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className='logo' />
            <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
              <Menu.Item key='1'>
                <Link to='/portal' title='门户'>
                  <Icon type='user' />
                  <span>门户</span>
                </Link>
              </Menu.Item>
              <Menu.Item key='2'>
                <Link to='/'>
                  <Icon type='video-camera' />
                  <span>首页</span>
                </Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <Link to='/'>
                  <Icon type='upload' />
                  <span>nav 2</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className='trigger'
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content
              id='content'
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
              <Switch>
                <Route path='/:module' component={SubModuleAsync} />
                <Route path='/' component={HomeAsync} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
