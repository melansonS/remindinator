import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import Header from './Header';
import Login from '../views/Login';
import Signup from '../views/Signup';

const Container = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLoggedUpdate = (value) => {
    setIsLoggedIn(value);
  };

  const autoLogin = async () => {
    const response = await fetch('/api/v1/auto-login', {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    setIsLoggedIn(body.success);
    if (body.success) {
      // navigate directly to the Dashboard
      history.push('/dashboard');
    } else if (location.pathname !== '/login') {
      // navigate back to the Signup Page
      history.push('/');
    }
  };
  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <div className="container">
      <Header handleLoggedUpdate={handleLoggedUpdate} isLoggedIn={isLoggedIn} />
      <div className="main-container">
        { isLoggedIn ? (
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        ) : (
          <>
            <Route path="/" exact>
              <Signup handleLoggedUpdate={handleLoggedUpdate} />
            </Route>
            <Route path="/login">
              <Login handleLoggedUpdate={handleLoggedUpdate} />
            </Route>
          </>
        )}
      </div>

    </div>
  );
};

export default Container;
