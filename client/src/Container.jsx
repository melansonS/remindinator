import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Signup from './views/Signup';

const Container = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLoggedUpdate = (value) => {
    setIsLoggedIn(value);
  };

  const autoLogin = async () => {
    const response = await fetch('http://localhost:8888/auto-login', {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    setIsLoggedIn(body.success);
    if (body.success) {
      history.push('/dashboard');
    } else if (location.pathname !== '/login') {
      history.push('/');
    }
  };
  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <div>
      { isLoggedIn && (<Header handleLoggedUpdate={handleLoggedUpdate} />)}
      <Route path="/" exact>
        <Signup handleLoggedUpdate={handleLoggedUpdate} />
      </Route>
      <Route path="/login">
        <Login handleLoggedUpdate={handleLoggedUpdate} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    </div>
  );
};

export default Container;
