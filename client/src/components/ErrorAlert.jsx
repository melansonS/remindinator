import { Alert } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

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
