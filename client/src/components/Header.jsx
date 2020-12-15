import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const Header = (props) => {
  const { handleLoggedUpdate, isLoggedIn } = props;
  const history = useHistory();

  const logoutSubmit = async () => {
    const response = await fetch('http://localhost:8888/logout', {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      handleLoggedUpdate(false);
      history.push('/login');
    }
    console.log(body);
  };

  return (
    <div className="app-header">
      <h1 className="app-header-title">Reminderizer!</h1>
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
