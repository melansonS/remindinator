const sgMail = require('@sendgrid/mail');
const db = require('../db');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const buildHtml = (reminders) => `<div><h3>Here are today's reminders!</h3><ul>${reminders.map((reminder) => `<li><p>${reminder}</p></li>`).join('')}</ul></div>`;
const buildEmail = (recipient, reminders) => ({
  to: recipient,
  from: process.env.SENDER_EMAIL,
  subject: 'Daily Reminderizing',
  text: `Here are today's Reminder! \n\n${reminders.join('\n\n')}`,
  html: `<strong>${buildHtml(reminders)}</strong>`,
});

const sendMail = async (recipient, reminders) => {
  try {
    const msg = buildEmail(recipient, reminders);
    const email = await sgMail.send(msg);
    return email;
  } catch (err) {
    console.error(err);
    if (err.response) {
      console.error(err.response.body);
    }
    return err;
  }
};

const sendEmails = async () => {
  try {
    // get all users that have reminders
    const users = await db.query('SELECT id, email FROM users WHERE EXISTS (SELECT user_id FROM reminders WHERE users.id = reminders.user_id)');
    const responses = users.rows.map(async ({ id, email }) => {
      // get the reminders tied to each of the users
      const results = await db.query('SELECT reminder FROM reminders WHERE user_id = $1 ORDER BY id ASC', [id]);
      const reminders = results.rows.map((row) => row.reminder);
      const response = await sendMail(email, reminders);
      return response;
    });
    return await Promise.all(responses);
  } catch (err) {
    console.error(err);
    return err;
  }
};

module.exports = {
  sendEmails,
};
