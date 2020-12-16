import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { LogoutOutlined, ReadFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import API_URL from '../lib/constants';

const Header = (props) => {
  const { handleLoggedUpdate, isLoggedIn } = props;
  const history = useHistory();

  const logoutSubmit = async () => {
    const response = await fetch(`${API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      handleLoggedUpdate(false);
      history.push('/login');
    }
  };

  return (
    <div className="app-header">
      <h1 className="app-header-title">
        Reminderizer!
        {' '}
        <ReadFilled />
        {' '}
      </h1>
      {isLoggedIn && (
      <Button
        className="app-header-logout"
        onClick={logoutSubmit}
        shape="circle"
        title="Log out"
      >
        <LogoutOutlined />
      </Button>
      )}
    </div>
  );
};

Header.propTypes = {
  handleLoggedUpdate: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
