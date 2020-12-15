import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Reminder = (props) => {
  const { id, text, deleteReminder } = props;
  return (
    <Card className="dashboard-reminder">
      {text}
      <Button
        className="dashboard-reminder-delete"
        onClick={() => deleteReminder(id)}
        shape="circle"
        size="small"
        title="Delete Reminder"
        type="ghost"
      >
        <CloseOutlined />
      </Button>
    </Card>
  );
};

Reminder.propTypes = {
  deleteReminder: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Reminder;
