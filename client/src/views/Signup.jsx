import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

const Signup = (props) => {
  const { handleLoggedUpdate } = props;
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8888/signup', {
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
      console.log(body.errorMessage);
    }
  };
  return (
    <div>
      <h1>Signup</h1>
      <Link to="/login">Login</Link>
      <form onSubmit={handleSignupSubmit}>
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

Signup.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
};

export default Signup;
