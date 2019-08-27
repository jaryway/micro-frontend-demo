import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Switch } from 'react-router-dom';
import { createHashHistory } from 'history';

// document.getElementById

function App() {
  return (
    <Router history={createHashHistory()}>
      <Switch>
        <Route path='/user' component={User} />
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  );
  // return <div className='portal'>Wo! This is portal site</div>;
}

function Home() {
  return <div className='portal'>Wo! This is home </div>;
}

function User() {
  return <div>this is user page</div>;
}

ReactDOM.render(<App />, document.getElementById('root'));
