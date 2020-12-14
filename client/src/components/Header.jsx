import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const Header = (props) => {
  const { isLoggedIn } = props;
  const history = useHistory();

  const logoutSubmit = async () => {
    const response = await fetch('http://localhost:8888/logout', {
      credentials: 'include',
      method: 'POST',
    });
    const body = await response.json();
    if (body.success) {
      // setIsLoggedIn(false);
      history.push('/login');
    }
    console.log(body);
  };

  return (
    <div>
      <div>
        You&apos;re logged in!
        {' '}
        <button type="button" onClick={logoutSubmit}>Log out</button>
      </div>
    </div>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
