import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Reminder from '../components/Reminder';

const Dashboard = (props) => {
  const { userId } = props;
  const [reminders, setReminders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newReminderValue, setNewReminderValue] = useState('');

  const getReminders = async (id) => {
    if (!id) { return null; }
    const response = await fetch('http://localhost:8888/reminders', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();
    if (body.success) {
      setReminders(body.reminders);
    }
    console.log(body);
    return null;
  };

  const handleDeleteReminder = async (id) => {
    const response = await fetch('http://localhost:8888/delete-reminder', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();
    if (body.success) {
      // filter the current Reminders to remove whichever one was successfully deleted
      const filtered = reminders.filter((reminder) => reminder.id !== id);
      setReminders(filtered);
    }
    console.log(body);
  };

  const handleAddReminder = async () => {
    const response = await fetch('http://localhost:8888/add-reminder', {
      method: 'POST',
      body: JSON.stringify({ reminder: newReminderValue, userId }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();
    if (body.success) {
      // add the newly stored Reminder to the reminders in the State
      setReminders([...reminders, body.reminder]);
      setNewReminderValue('');
    }
    console.log(body);
  };

  useEffect(() => {
    getReminders(userId);
  }, [userId]);

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>
        ID:
        {' '}
        {userId}
      </h3>
      <div>
        <input type="text" value={newReminderValue} onChange={(e) => setNewReminderValue(e.target.value)} />
        <input type="button" value="Add Reminder!" onClick={handleAddReminder} />
      </div>
      {reminders && reminders.map((item) => (
        <Reminder
          deleteReminder={handleDeleteReminder}
          id={item.id}
          text={item.reminder}
        />
      ))}
    </div>
  );
};

Dashboard.defaultProps = {
  userId: null,
};

Dashboard.propTypes = {
  userId: PropTypes.number,
};

export default Dashboard;
