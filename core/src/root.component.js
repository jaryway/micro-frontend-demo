import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
// import App from './pages/App';
import BasicLayout from './layouts/BasicLayout';

// const location = history.location
// const { AuthorizedRoute } = Authorized
export default class RootComponent extends React.Component {
  state = {
    store: this.props.store,
    globalEventDistributor: this.props.globalEventDistributor,
    currentUser: undefined,
    isRender: true,
    loading: true,
  };

  componentDidMount() {
    console.log('componentDidMounts');
    this.props.globalEventDistributor.dispatch({ type: "User'" });
    this.getCurrentUser();
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }
  setStore(store) {
    this.setState({ ...this.state, store: store });
  }

  setGlobalEventDistributor(globalEventDistributor) {
    this.setState({ ...this.state, globalEventDistributor: globalEventDistributor });
  }

  getCurrentUser = async () => {
    this.setState({ loading: true, currentUser: undefined });
    const currentUser = await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    }).then(() => {
      return { name: 'xiaoming' };
    });

    this.setState({ loading: false, currentUser });
  };

  render() {
    let conponent = <div></div>;
    const { loading, currentUser } = this.state;
    //   const routerData = getRouterData()
    let customProps = { globalEventDistributor: this.state.globalEventDistributor };
    console.log('customProps', this.props.store.getState());

    if (loading) {
      return (
        <div style={{ paddingTop: 250, textAlign: 'center' }}>
          <Spin size='large' tip='正在加载用户信息..' />
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div style={{ paddingTop: 250, textAlign: 'center' }}>
          <Spin spinning={true} size='large' tip='无效用户信息' />
        </div>
      );
    }

    if (this.state.store && this.state.globalEventDistributor && this.state.isRender) {
      conponent = (
        <Provider store={this.state.store || {}}>
          <Router history={this.props.history}>
            <Switch>
              <Route
                path='/'
                render={props => <BasicLayout {...props} currentUser={this.state.currentUser} />}
              ></Route>
            </Switch>
          </Router>
        </Provider>
      );
    }
    return conponent;
  }
}
