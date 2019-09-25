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

function App(props) {
  console.log('props', props);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/topics'>Topics</Link>
          </li>
        </ul>
        {/* <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a> */}
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </header>
    </div>
  );
}

export default App;
