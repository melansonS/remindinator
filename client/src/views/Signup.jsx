import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

export default Signup;
