import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'

import logo from './logo.svg';
import './App.css';

import Home from './Home'
import About from './About'

// import { getUsers } from './actions'
// componentWillMount() {
//   getUsers().then(users => {
//     this.setState({
//       users
//     });
//   }).catch(err => {
//     this.setState({
//       users: 'fail'
//     });
//     console.error('api/users request fail', err);
//   });
// }

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to="/">Home</Link>&NBSP;
          <Link to="/about-us">About</Link>
        </header>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Rover</h1>
        </header>

        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/about-us" component={About} />
        </main>
      </div>
    );
  }
}

export default App;
