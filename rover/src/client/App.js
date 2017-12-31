import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { getUsers } from './request'

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: null
    }
  }

  componentWillMount() {
    getUsers().then(users => {
      console.log(users);
      this.setState({
        users
      });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Rover</h1>
        </header>
        <p className="App-intro">
          {JSON.stringify(this.state.users)}
        </p>
      </div>
    );
  }
}

export default App;
