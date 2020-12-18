import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';

const AuthForm = (props) => {
  const {
    formSubmit, submitValue, validateEmail, validatePassword,
  } = props;
  const [form] = Form.useForm();
  const validate = (rule, value) => {
    if (value.length < 7) {
      return Promise.reject('Must be at least 7 Characters long');
    }
    return Promise.resolve();
  };

  const onFinish = (values) => {
    formSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="register"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: validateEmail ? 'email' : null,
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
  validateEmail: false,
  validatePassword: false,
};

AuthForm.propTypes = {
  formSubmit: PropTypes.func.isRequired,
  submitValue: PropTypes.string,
  validateEmail: PropTypes.bool,
  validatePassword: PropTypes.bool,
};

export default AuthForm;
