import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Signup from './views/Signup';

const Container = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const history = useHistory();
  const location = useLocation();

  const handleLoggedUpdate = (value) => {
    setIsLoggedIn(value);
  };
  const handleUserIdUpdate = (value) => {
    setUserId(value);
  };

  const autoLogin = async () => {
    const response = await fetch('http://localhost:8888/auto-login', {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    setIsLoggedIn(body.success);
    if (body.success) {
      setUserId(body.userId);
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
    <div>
      <Header handleLoggedUpdate={handleLoggedUpdate} isLoggedIn={isLoggedIn} />
      { isLoggedIn ? (
        <Route path="/dashboard">
          <Dashboard userId={userId} />
        </Route>
      ) : (
        <>
          <Route path="/" exact>
            <Signup
              handleLoggedUpdate={handleLoggedUpdate}
              handleUserIdUpdate={handleUserIdUpdate}
            />
          </Route>
          <Route path="/login">
            <Login
              handleLoggedUpdate={handleLoggedUpdate}
              handleUserIdUpdate={handleUserIdUpdate}
            />
          </Route>
        </>
      )}

    </div>
  );
};

export default Container;
