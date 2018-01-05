import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Switch } from 'react-router';

import './App.css';

import Home from './Home';
import Search from './Search/Search';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="header">
          <Link to="/">
            <img className="logo" src="logo.png" alt="We're the dog people" />
          </Link>
        </header>
        <main className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />
            <Route component={ Home } />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
