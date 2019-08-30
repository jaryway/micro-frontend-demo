import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import App from './pages/App';

// const location = history.location
// const { AuthorizedRoute } = Authorized
export default class RootComponent extends React.Component {
  state = {
    store: this.props.store,
    globalEventDistributor: this.props.globalEventDistributor,
    currentUser: { name: '' },
    isRender: true,
  };

  componentDidCatch(error, info) {
    console.log(error, info);
  }
  setStore(store) {
    this.setState({ ...this.state, store: store });
  }

  setGlobalEventDistributor(globalEventDistributor) {
    this.setState({ ...this.state, globalEventDistributor: globalEventDistributor });
  }

  render() {
    let conponent = <div></div>;
    //   const routerData = getRouterData()
    let customProps = { globalEventDistributor: this.state.globalEventDistributor };
    console.log('customProps', customProps);

    if (this.state.store && this.state.globalEventDistributor && this.state.isRender) {
      conponent = (
        <Provider store={this.state.store || {}}>
          <Router history={this.props.history}>
            <Switch>
              <Route path='/' component={App}></Route>
              {/* <AuthorizedRoute
                path='/'
                render={props => <BasicLayout {...customProps} {...props} currentUser={this.state.currentUser} />}
              /> */}
            </Switch>
          </Router>
        </Provider>
      );
    }
    return conponent;
  }
}
