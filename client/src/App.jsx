import React, { useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Signup from './views/Signup';
import Login from './views/Login';
import Dashboard from './views/Dashboard';

function App() {
  const ping = async () => {
    const response = await fetch('http://localhost:8888', {
      credentials: 'include',
    });
    const body = await response.json();
    if (body.success) {
      console.log(body.users);
    } else {
      console.log('Error');
    }
  };
  useEffect(() => {
    ping();
  });

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1> Hello world!</h1>
          <Route path="/" exact>
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </header>
      </div>
    </Router>
  );
}

export default App;
