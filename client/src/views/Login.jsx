import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  console.log('hi');
  return (
    <div>
      <h1>Login</h1>
      <Link to="/">Signup</Link>
    </div>
  );
};

export default Login;
