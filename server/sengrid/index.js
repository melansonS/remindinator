const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const buildEmail = (recipient, content) => ({
  to: recipient,
  from: process.env.SENDER_EMAIL,
  subject: 'Brought to you by Twilio Sengrid',
  text: content,
  html: `<strong>${content}</strong>`,
});

const sendMail = async (recipient, content) => {
  const msg = buildEmail(recipient, content);
  const email = await sgMail.send(msg);
  console.log(email);
};

module.exports = {
  sendMail,
};
