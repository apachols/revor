import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

import Home from './Home'
import Search from './Search'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to="/">Home</Link>
          <div> </div>
          <Link to="/search">Search</Link>
        </header>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Rover</h1>
        </header>
        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={Search} />
        </main>
      </div>
    );
  }
}

export default App;
