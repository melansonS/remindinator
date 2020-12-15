import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

const Signup = (props) => {
  const { handleLoggedUpdate, handleUserIdUpdate } = props;
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8888/signup', {
      credentials: 'include',
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      console.log(body);
      handleLoggedUpdate(true);
      handleUserIdUpdate(body.userId);
      // navigate directly to the Dashboard
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
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="email"
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
  handleUserIdUpdate: PropTypes.func.isRequired,
};

export default Signup;
