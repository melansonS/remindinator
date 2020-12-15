import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { Button, Form } from 'antd';
import 'antd/dist/antd.css';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';

const Login = (props) => {
  const { handleLoggedUpdate, handleUserIdUpdate } = props;
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [form] = Form.useForm();
  console.log(form);

  const onFinish = async (values) => {
    const { email, password } = values;
    const response = await fetch('http://localhost:8888/login', {
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
      console.log(body.errorMessage);
      setErrorMessage(body.errorMessage);
      form.resetFields();
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <AuthForm form={form} onFinish={onFinish} submitValue="Log in" />
      {errorMessage && (<ErrorAlert errorMessage={errorMessage} />)}
      <Button type="link">
        <Link to="/">Signup</Link>
      </Button>
    </div>
  );
};

Login.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
  handleUserIdUpdate: PropTypes.func.isRequired,
};

export default Login;
