import React from 'react';
import { Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
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

function App(props) {
  console.log('props', props);
  return (
    <div className=''>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/sub-app1'>sub-app1</Link>
        </li>
      </ul>

      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
      <Route path='/sub-app1' component={SubApp} />
    </div>
  );
}

export default App;
