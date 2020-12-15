import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { Button, Form } from 'antd';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';

const Signup = (props) => {
  const { handleLoggedUpdate, handleUserIdUpdate } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { email, password } = values;
    const response = await fetch('http://localhost:8888/signup', {
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
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
      form.resetFields();
      console.log(body.errorMessage);
    }
  };
  return (
    <div>
      <h1>Signup</h1>
      <AuthForm form={form} onFinish={onFinish} submitValue="Sign up" validatePassword />
      {errorMessage && (<ErrorAlert errorMessage={errorMessage} />)}
      <Button type="link">
        <Link to="/login">Login</Link>
      </Button>
    </div>
  );
};

Signup.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
  handleUserIdUpdate: PropTypes.func.isRequired,
};

export default Signup;
