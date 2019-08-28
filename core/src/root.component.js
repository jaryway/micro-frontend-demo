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

  //   async componentWillMount() {
  //     this.initMenu();
  //     this.props.history.listen((location, action) => {
  //       console.log('asdfasdfasdfasf', location, action);

  //       if (action === 'PUSH') {
  //         this.props.globalEventDistributor.dispatch({
  //           type: 'to',
  //           path: location.pathname,
  //           owner: 'base',
  //         });
  //       }
  //     });
  //   }
  //   initMenu() {
  //     let store = this.state.globalEventDistributor.getState();
  //     let menu = [];
  //     Object.keys(store).forEach(name => {
  //       if (store[name].menu) {
  //         if (_.isArray(store[name].menu)) {
  //           store[name].menu.forEach(item => {
  //             pushStore(item);
  //           });
  //         } else {
  //           pushStore(store[name].menu);
  //         }
  //       }
  //     });
  //   }

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
