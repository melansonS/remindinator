import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';

const ErrorAlert = (props) => {
  const { errorMessage } = props;
  return (
    <Alert
      message={errorMessage}
      type="error"
      showIcon
    />
  );
};

ErrorAlert.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorAlert;
