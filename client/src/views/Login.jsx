import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

const Login = (props) => {
  const { handleLoggedUpdate } = props;
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8888/login', {
      credentials: 'include',
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      console.log(body);
      handleLoggedUpdate(true);
      history.push('/dashboard');
    } else {
      setErrorMessage(body.errorMessage);
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <Link to="/">Signup</Link>
      <form onSubmit={handleLoginSubmit}>
        <input
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="username"
          required
          type="text"
        />
        <input
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Password"
          required
          type="text"
        />
        <input type="submit" />
      </form>
    </div>
  );
};

Login.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
};

export default Login;
