import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Input } from 'antd';
import API_URL from '../lib/constants';
import Reminder from '../components/Reminder';

const Dashboard = (props) => {
  const { userId } = props;
  const [reminders, setReminders] = useState([]);
  const [newReminderValue, setNewReminderValue] = useState('');

  const getReminders = async (id) => {
    if (!id) { return null; }
    const response = await fetch(`${API_URL}/reminders`, {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();
    if (body.success) {
      setReminders(body.reminders);
    }
    return null;
  };

  const handleDeleteReminder = async (id) => {
    const response = await fetch(`${API_URL}/delete-reminder`, {
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
  };

  const handleAddReminder = async () => {
    // ensure that there is at least a word character or a digit
    // prevents users from sending reminders that look empty ie '\n'
    const regex = /[\w\d]/;
    const found = newReminderValue.match(regex);
    if (!found) { return null; }
    const response = await fetch(`${API_URL}/add-reminder`, {
      method: 'POST',
      body: JSON.stringify({ reminder: newReminderValue.trim(), userId }),
      headers: { 'content-type': 'application/json' },
    });
    const body = await response.json();
    if (body.success) {
      // add the newly stored Reminder to the reminders in the State
      setReminders([...reminders, body.reminder]);
      setNewReminderValue('');
    }
    return null;
  };

  useEffect(() => {
    getReminders(userId);
  }, [userId]);

  return (
    <div>
      <h1 className="dashboard-header">Dashboard</h1>
      <div className="dashboard-add-reminder">
        <Input.TextArea
          showCount
          maxLength={140}
          onChange={(e) => setNewReminderValue(e.target.value)}
          placeholder="Add a new reminder ..."
          rows={4}
          value={newReminderValue}
        />
        <Button
          onClick={handleAddReminder}
          type="default"
        >
          Add reminder!
        </Button>
      </div>
      <Divider />
      <div className="dashboard-reminder-container">
        {reminders && reminders.map((item) => (
          <Reminder
            deleteReminder={handleDeleteReminder}
            id={item.id}
            key={`dashboard-reminder-${item.id}`}
            text={item.reminder}
          />
        ))}
      </div>
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
