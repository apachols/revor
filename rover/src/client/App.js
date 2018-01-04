import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'

import './App.css';

import Home from './Home'
import Search from './Search'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Link to="/">
            <img className="logo" src="logo.png" alt="We're the dog people" />
          </Link>
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
