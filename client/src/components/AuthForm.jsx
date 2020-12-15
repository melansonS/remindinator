import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import 'antd/dist/antd.css';

const AuthForm = (props) => {
  const {
    form, onFinish, submitValue, validatePassword,
  } = props;

  const validate = (rule, value) => {
    if (value.length < 7) {
      return Promise.reject('Must be at least 7 Characters long');
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="register"
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid Email!',
          },
          {
            required: true,
            message: 'Please input your Email',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password',
          },
          {
            validator: validatePassword ? validate : null,
            message: 'Password must be at least 7 characters long',
          },
        ]}
        hasFeedback={validatePassword}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitValue}
        </Button>
      </Form.Item>
    </Form>
  );
};

AuthForm.defaultProps = {
  submitValue: 'Submit',
  validatePassword: false,
};

AuthForm.propTypes = {
  form: PropTypes.objectOf(PropTypes.any).isRequired,
  onFinish: PropTypes.func.isRequired,
  submitValue: PropTypes.string,
  validatePassword: PropTypes.bool,
};

export default AuthForm;
