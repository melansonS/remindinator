import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [usernameInput, setUsernameInput] = useState('');
  return (
    <div>
      <h1>SIGNUP</h1>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Signup;
