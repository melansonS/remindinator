import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import API_URL from '../lib/constants';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';

const Login = (props) => {
  const { handleLoggedUpdate } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleLoginSubmit = async (values) => {
    const { email, password } = values;
    const response = await fetch('/api/v1/login', {
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
      }),
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      handleLoggedUpdate(true);
      // navigate directly to the Dashboard
      history.push('/dashboard');
    } else {
      setErrorMessage(body.errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <AuthForm formSubmit={handleLoginSubmit} submitValue="Log in" />
      {errorMessage && (<ErrorAlert errorMessage={errorMessage} />)}
      <div className="auth-redirect">
        <p> Don&apos;t have an account yet? :</p>
        <Link to="/">
          <Button type="link">
            Signup
          </Button>
        </Link>
      </div>
    </div>
  );
};

Login.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
};

export default Login;
