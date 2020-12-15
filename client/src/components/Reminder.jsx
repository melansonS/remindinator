import React from 'react';
import PropTypes from 'prop-types';

const Reminder = (props) => {
  const { id, text, deleteReminder } = props;
  return (
    <div>
      {text}
      <button type="button" onClick={() => { deleteReminder(id); }}>X</button>
    </div>
  );
};

Reminder.propTypes = {
  deleteReminder: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Reminder;
