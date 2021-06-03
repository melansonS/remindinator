import React, { useEffect, useState, useCallback } from "react";
import { Redirect, Route, useHistory, useLocation } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import Login from "./views/Login";
import Signup from "./views/Signup";

const Container = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLoggedUpdate = (value) => {
    setIsLoggedIn(value);
  };

  const autoLogin = useCallback(async () => {
    const response = await fetch("/api/v1/auto-login", {
      credentials: "include",
    });
    const body = await response.json();
    setIsLoggedIn(body.success);
    if (body.success) {
      // navigate directly to the Dashboard
      history.push("/dashboard");
    } else if (location.pathname !== "/login") {
      // navigate back to the Signup Page
      history.push("/");
    }
  }, [history, location.pathname]);

  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <div className="container">
      <Header handleLoggedUpdate={handleLoggedUpdate} isLoggedIn={isLoggedIn} />
      <div className="main-container">
        <Route exact path="/">
          {isLoggedIn ? (
            <Redirect to="/dashboard" />
          ) : (
            <Signup handleLoggedUpdate={handleLoggedUpdate} />
          )}
        </Route>
        <Route exact path="/login">
          {isLoggedIn ? (
            <Redirect to="/dashboard" />
          ) : (
            <Login handleLoggedUpdate={handleLoggedUpdate} />
          )}
        </Route>
        <Route exact path="/dashboard">
          {isLoggedIn ? <Dashboard /> : <Redirect to="/dashboard" />}
        </Route>
      </div>
    </div>
  );
};

export default Container;
